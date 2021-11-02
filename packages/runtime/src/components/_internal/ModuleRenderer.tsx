import { Static } from '@sinclair/typebox';
import React from 'react';
import { RuntimeApplication } from '@meta-ui/core';
import { MetaUIServices, RuntimeModuleSchema } from '../../types/RuntimeSchema';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';
import { parseTypeComponents } from '../chakra-ui/List';
import { resolveAppComponents } from '../../services/resolveAppComponents';
import { ImplWrapper } from '../../services/ImplWrapper';
import { watch } from '../../utils/watchReactivity';
import { get } from 'lodash';
import { useEffect } from 'react';

type Props = Static<typeof RuntimeModuleSchema> & {
  evalScope: Record<string, any>;
  services: MetaUIServices;
  app?: RuntimeApplication;
};

export const ModuleRenderer: React.FC<Props> = props => {
  const { type, properties, handlers, evalScope, services, app } = props;

  // first eval the property of module
  const {
    properties: moduleProperties,
    handlers: moduleHandlers,
    moduleId,
  } = services.stateManager.mapValuesDeep(
    { properties, handlers, moduleId: props.id },
    ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, true, evalScope);
      }
      return value;
    }
  );

  const runtimeModule = services.registry.getModuleByType(type);
  const parsedtemplete = runtimeModule.spec.components.map(parseTypeComponents);
  // then eval the template and stateMap of module
  const { parsedtemplete: evaledModuleTemplate, stateMap: evaledStateMap } =
    services.stateManager.mapValuesDeep(
      { parsedtemplete, stateMap: runtimeModule.spec.stateMap },
      ({ value }) => {
        if (typeof value === 'string') {
          return services.stateManager.maskedEval(value, true, {
            ...moduleProperties,
            $moduleId: moduleId,
          });
        }
        return value;
      }
    );

  // listen component state change
  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    for (const stateKey in evaledStateMap) {
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
  }, [evaledStateMap, services]);

  // listen module event
  useEffect(() => {
    const _handlers = moduleHandlers as Array<Static<typeof EventHandlerSchema>>;
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
    });

    return () => {
      moduleEventHanlders.forEach(h => {
        services.apiService.off('moduleEvent', h);
      });
    };
  }, [moduleHandlers]);

  const { topLevelComponents, slotComponentsMap } = resolveAppComponents(
    evaledModuleTemplate,
    {
      services,
      app,
    }
  );

  const results = topLevelComponents.map(c => {
    return (
      <ImplWrapper
        key={c.id}
        component={c}
        slotsMap={slotComponentsMap.get(c.id)}
        targetSlot={null}
        services={services}
        app={app}
      />
    );
  });

  return <>{results}</>;
};
