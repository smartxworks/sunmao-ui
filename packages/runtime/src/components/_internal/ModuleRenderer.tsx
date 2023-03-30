import { Static } from '@sinclair/typebox';
import React, { useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  Application,
  parseType,
  RuntimeApplication,
  RuntimeComponentSchema,
  PropsAfterEvaled,
} from '@sunmao-ui/core';
import { ImplWrapper } from './ImplWrapper';
import { watch } from '../../utils/watchReactivity';
import { ImplementedRuntimeModule, UIServices } from '../../types';
import { EventHandlerSpec, ModuleRenderSpec } from '@sunmao-ui/shared';
import { resolveChildrenMap } from '../../utils/resolveChildrenMap';
import { initStateAndMethod } from '../../utils/initStateAndMethod';
import { ExpressionError } from '../../services/StateManager';
import { UIMethodPayload } from '../../services/apiService';

type Props = Static<typeof ModuleRenderSpec> & {
  evalScope?: Record<string, any>;
  services: UIServices;
  app: RuntimeApplication;
  className?: string;
  containerId?: string;
};

export const ModuleRenderer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { type, services } = props;
  try {
    const moduleSpec = services.registry.getModuleByType(type);
    return <ModuleRendererContent {...props} ref={ref} moduleSpec={moduleSpec} />;
  } catch {
    return <div ref={ref}>Cannot find Module {type}.</div>;
  }
});

const ModuleRendererContent = React.forwardRef<
  HTMLDivElement,
  Props & { moduleSpec: ImplementedRuntimeModule }
>((props, ref) => {
  const {
    moduleSpec,
    properties,
    handlers,
    evalScope,
    services,
    app,
    className,
    containerId,
  } = props;

  function evalObject<T extends Record<string, any> = Record<string, any>>(
    obj: T
  ): PropsAfterEvaled<T> {
    const evalOptions = { scopeObject: evalScope };
    return services.stateManager.deepEval(obj, evalOptions) as PropsAfterEvaled<T>;
  }

  // first eval the property, handlers, id of module
  const evaledProperties = evalObject(properties);
  const moduleId = services.stateManager.deepEval(props.id, {
    scopeObject: evalScope,
  }) as string | ExpressionError;
  const parsedTemplate = useMemo(
    () => moduleSpec.impl.map(parseTypeComponents),
    [moduleSpec]
  );

  // then eval the template, methods and stateMap of module
  const evaledStateMap = useMemo(() => {
    // stateMap only use state i
    return services.stateManager.deepEval(moduleSpec.spec.stateMap, {
      scopeObject: { $moduleId: moduleId },
      overrideScope: true,
    });
  }, [services.stateManager, moduleSpec.spec.stateMap, moduleId]);

  // then eval the methods a of module
  const evaledMethods = useMemo(() => {
    return services.stateManager.deepEval(
      { result: moduleSpec.spec.methods },
      {
        scopeObject: { $moduleId: moduleId },
        overrideScope: true,
      }
    ).result;
  }, [services.stateManager, moduleSpec.spec.methods, moduleId]);

  const evaledModuleTemplate: RuntimeComponentSchema[] = useDeepCompareMemo(() => {
    // here should only eval with evaledProperties, any other key not in evaledProperties should be ignored
    // so we can assume that template will not change if evaledProperties is the same
    return services.stateManager.deepEval(
      { template: parsedTemplate },
      {
        scopeObject: {
          ...evaledProperties,
          $moduleId: moduleId,
        },
        ignoreEvalError: true,
        overrideScope: true,
        fallbackWhenError: exp => exp,
      }
    ).template;
  }, [parsedTemplate, evaledProperties, moduleId]);

  // listen component state change
  useEffect(() => {
    if (!evaledStateMap || moduleId instanceof ExpressionError) return;

    const stops: ReturnType<typeof watch>[] = [];

    if (!services.stateManager.store[moduleId]) {
      services.stateManager.store[moduleId] = {};
    }
    for (const stateKey in evaledStateMap) {
      // init state
      services.stateManager.store[moduleId][stateKey] = get(
        services.stateManager.store,
        evaledStateMap[stateKey]
      );
      // watch state
      const stop = watch(
        () => {
          return get(services.stateManager.store, evaledStateMap[stateKey]);
        },
        newV => {
          services.stateManager.store[moduleId] = {
            ...services.stateManager.store[moduleId],
            [stateKey]: newV,
          };
        }
      );
      stops.push(stop);
    }

    return () => {
      stops.forEach(s => s());
    };
  }, [evaledStateMap, moduleId, services]);

  // listen module event
  useEffect(() => {
    if (!handlers) return;
    const _handlers = handlers as Array<Static<typeof EventHandlerSpec>>;
    const moduleEventHandlers: any[] = [];
    _handlers.forEach(h => {
      const moduleEventHandler = ({ fromId, eventType }: Record<string, string>) => {
        if (eventType === h.type && fromId === moduleId) {
          const evaledHandler = services.stateManager.deepEval(h, {
            scopeObject: evalScope,
          });
          services.apiService.send('uiMethod', {
            componentId: evaledHandler.componentId,
            name: evaledHandler.method.name,
            parameters: evaledHandler.method.parameters,
            triggerId: moduleId,
            eventType,
          });
        }
      };
      services.apiService.on('moduleEvent', moduleEventHandler);
      moduleEventHandlers.push(moduleEventHandler);
    });

    return () => {
      moduleEventHandlers.forEach(h => {
        services.apiService.off('moduleEvent', h);
      });
    };
  }, [evalScope, handlers, moduleId, services.apiService, services.stateManager]);

  // listen methods calling
  useEffect(() => {
    const methodHandlers: Array<(payload: UIMethodPayload) => void> = [];
    evaledMethods.forEach(methodMap => {
      const handler = (payload: UIMethodPayload) => {
        if (payload.componentId === containerId && payload.name === methodMap.name) {
          services.apiService.send('uiMethod', {
            ...payload,
            componentId: methodMap.componentId,
            name: methodMap.componentMethod,
            triggerId: containerId,
          });
        }
      };
      services.apiService.on('uiMethod', handler);
      methodHandlers.push(handler);
    });

    return () => {
      methodHandlers.forEach(h => {
        services.apiService.off('uiMethod', h);
      });
    };
  }, [containerId, evaledMethods, services.apiService]);

  const result = useMemo(() => {
    // Must init components' state, otherwise store cannot listen these components' state changing
    initStateAndMethod(services.registry, services.stateManager, evaledModuleTemplate);
    const { childrenMap, topLevelComponents } = resolveChildrenMap(evaledModuleTemplate);
    return topLevelComponents.map(c => {
      return (
        <ImplWrapper
          key={c.id}
          component={c}
          services={services}
          app={app}
          allComponents={evaledModuleTemplate}
          childrenMap={childrenMap}
          isInModule={true}
        />
      );
    });
  }, [evaledModuleTemplate, services, app]);

  return (
    <div className={className} ref={ref}>
      {result}
    </div>
  );
});

function parseTypeComponents(
  c: Application['spec']['components'][0]
): RuntimeComponentSchema {
  return {
    ...c,
    parsedType: parseType(c.type),
    traits: c.traits.map(t => {
      return {
        ...t,
        parsedType: parseType(t.type),
      };
    }),
  };
}
