import { Static } from '@sinclair/typebox';
import React, { useEffect, useMemo } from 'react';
import { get } from 'lodash-es';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  Application,
  parseType,
  RuntimeApplication,
  RuntimeComponentSchema,
} from '@sunmao-ui/core';
import { ImplWrapper } from './ImplWrapper';
import { watch } from '../../utils/watchReactivity';
import { ImplementedRuntimeModule, UIServices } from '../../types';
import { EventHandlerSpec, ModuleSpec } from '@sunmao-ui/shared';
import { resolveChildrenMap } from '../../utils/resolveChildrenMap';
import { initStateAndMethod } from '../../utils/initStateAndMethod';
import { ExpressionError } from '../../services/StateManager';

type Props = Static<typeof ModuleSpec> & {
  evalScope?: Record<string, any>;
  services: UIServices;
  app?: RuntimeApplication;
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
  const { moduleSpec, properties, handlers, evalScope, services, app } = props;
  const moduleId = services.stateManager.maskedEval(props.id, {
    evalListItem: true,
    scopeObject: evalScope,
  }) as string | ExpressionError;

  function evalObject<T extends Record<string, any>>(obj: T): T {
    const evalOptions = { evalListItem: true, scopeObject: evalScope };
    return services.stateManager.mapValuesDeep({ obj }, ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, evalOptions);
      }
      return value;
    }).obj;
  }

  // first eval the property, handlers, id of module
  const evaledProperties = evalObject(properties);
  const parsedTemplate = useMemo(
    () => moduleSpec.impl.map(parseTypeComponents),
    [moduleSpec]
  );

  // then eval the template and stateMap of module
  const evaledStateMap = useMemo(() => {
    // stateMap only use state i
    return services.stateManager.deepEval(moduleSpec.spec.stateMap, {
      evalListItem: false,
      scopeObject: { $moduleId: moduleId },
      overrideScope: true,
    });
  }, [services.stateManager, moduleSpec.spec.stateMap, moduleId]);

  const evaledModuleTemplate = useDeepCompareMemo(() => {
    // here should only eval with evaledProperties, any other key not in evaledProperties should be ignored
    // so we can assume that template will not change if evaledProperties is the same
    return services.stateManager.deepEval(
      { template: parsedTemplate },
      {
        evalListItem: false,
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
            evalListItem: true,
            scopeObject: evalScope,
          });
          services.apiService.send('uiMethod', {
            componentId: evaledHandler.componentId,
            name: evaledHandler.method.name,
            parameters: evaledHandler.method.parameters,
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
  }, [
    evalScope,
    handlers,
    moduleId,
    services.apiService,
    services.stateManager,
  ]);

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
          childrenMap={childrenMap}
          isInModule={true}
        />
      );
    });
  }, [evaledModuleTemplate, services, app]);

  return (
    <div className="module-container" ref={ref}>
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
