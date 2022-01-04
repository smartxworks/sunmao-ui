import { Static } from '@sinclair/typebox';
import React, { useCallback, useEffect, useMemo } from 'react';
import { get } from 'lodash-es';
import { useDeepCompareMemo } from 'use-deep-compare';
import { RuntimeApplication } from '@sunmao-ui/core';
import { UIServices, RuntimeModuleSchema } from '../../types/RuntimeSchema';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';
import { resolveAppComponents } from '../../services/resolveAppComponents';
import { ImplWrapper } from './ImplWrapper';
import { watch } from '../../utils/watchReactivity';
import { parseTypeComponents } from '../../utils/parseType';
import { ImplementedRuntimeModule } from '../../services/registry';
import { getSlotWithMap } from './Slot';

type Props = Static<typeof RuntimeModuleSchema> & {
  evalScope?: Record<string, any>;
  services: UIServices;
  app?: RuntimeApplication;
};

export const ModuleRenderer: React.FC<Props> = props => {
  const { type, services } = props;
  try {
    const moduleSpec = services.registry.getModuleByType(type);
    return <ModuleRendererContent {...props} moduleSpec={moduleSpec} />;
  } catch {
    return <span>Cannot find Module {type}.</span>;
  }
};

const ModuleRendererContent: React.FC<Props & { moduleSpec: ImplementedRuntimeModule }> =
  props => {
    const { moduleSpec, properties, handlers, evalScope, services, app } = props;
    const moduleId = services.stateManager.maskedEval(
      props.id,
      true,
      evalScope
    ) as string;

    function evalObject<T extends Record<string, any>>(obj: T): T {
      return services.stateManager.mapValuesDeep({ obj }, ({ value }) => {
        if (typeof value === 'string') {
          return services.stateManager.maskedEval(value, true, evalScope);
        }
        return value;
      }).obj;
    }

    const evalWithScope = useCallback(<T extends Record<string, any>>(
      obj: T,
      scope: Record<string, any>
    ): T =>{
      const hasScopeKey = (exp: string) => {
        return Object.keys(scope).some(key => exp.includes('{{') && exp.includes(key));
      };
      return services.stateManager.mapValuesDeep({ obj }, ({ value }) => {
        if (typeof value === 'string' && hasScopeKey(value)) {
          return services.stateManager.maskedEval(value, true, scope);
        }
        return value;
      }).obj;
    }, [services.stateManager]);

    // first eval the property, handlers, id of module
    const evaledProperties = evalObject(properties);
    const evaledHanlders = evalObject(handlers);
    const parsedtemplete = useMemo(
      () => moduleSpec.impl.map(parseTypeComponents),
      [moduleSpec]
    );

    // then eval the template and stateMap of module
    const evaledStateMap = useMemo(() => {
      // stateMap only use state i
      return evalWithScope(moduleSpec.spec.stateMap, { $moduleId: moduleId });
    }, [evalWithScope, moduleSpec.spec.stateMap, moduleId]);

    const evaledModuleTemplate = useDeepCompareMemo(() => {
      // here should only eval with evaledProperties, any other key not in evaledProperties should be ignored
      // so we can asumme that template will not change if evaledProperties is the same
      return evalWithScope(parsedtemplete, {
        ...evaledProperties,
        $moduleId: moduleId,
      });
    }, [parsedtemplete, evaledProperties, moduleId]);

    // listen component state change
    useEffect(() => {
      if (!evaledStateMap) return;

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
      if (!evaledHanlders) return;
      const _handlers = evaledHanlders as Array<Static<typeof EventHandlerSchema>>;
      const moduleEventHanlders: any[] = [];
      _handlers.forEach(h => {
        const moduleEventHanlder = ({ fromId, eventType }: Record<string, string>) => {
          if (eventType === h.type && fromId === moduleId) {
            services.apiService.send('uiMethod', {
              componentId: h.componentId,
              name: h.method.name,
              parameters: h.method.parameters,
            });
          }
        };
        services.apiService.on('moduleEvent', moduleEventHanlder);
        moduleEventHanlders.push(moduleEventHanlder);
      });

      return () => {
        moduleEventHanlders.forEach(h => {
          services.apiService.off('moduleEvent', h);
        });
      };
    }, [evaledHanlders, moduleId, services.apiService]);

    const result = useMemo(() => {
      const { topLevelComponents, slotComponentsMap } = resolveAppComponents(
        evaledModuleTemplate,
        {
          services,
          app,
        }
      );
      return topLevelComponents.map(c => {
        const slotsMap = slotComponentsMap.get(c.id);
        const Slot = getSlotWithMap(slotsMap);
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            slotsMap={slotsMap}
            Slot={Slot}
            targetSlot={null}
            services={services}
            app={app}
          />
        );
      });
    }, [evaledModuleTemplate, services, app]);

    return <>{result}</>;
  };
