import { Static } from '@sinclair/typebox';
import React from 'react';
import { RuntimeApplication } from '@meta-ui/core';
import { MetaUIServices, RuntimeApplicationComponent } from '../../types/RuntimeSchema';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';
import { parseTypeComponents } from '../chakra-ui/List';
import { resolveAppComponents } from '../../services/resolveAppComponents';
import { ImplWrapper } from '../../services/ImplWrapper';
import { watch } from '../../utils/watchReactivity';
import { get } from 'lodash';
import { useEffect } from 'react';

export type RuntimeModuleSchema = {
  id: string;
  type: string;
  properties: Record<string, string>;
  handlers: Array<Static<typeof EventHandlerSchema>>;
};

type Props = RuntimeModuleSchema & {
  evalScope: Record<string, any>;
  services: MetaUIServices;
  app?: RuntimeApplication;
};

export const ModuleRenderer: React.FC<Props> = props => {
  const { id, type, properties, handlers, evalScope, services, app } = props;

  // first eval the property of module
  const { properties: moduleProperties, handlers: modulesHandlers } =
    services.stateManager.mapValuesDeep({ properties, handlers }, ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, true, evalScope);
      }
      return value;
    });

  const runtimeModule = services.registry.getModuleByType(type);
  const parsedtemplete = runtimeModule.spec.components.map(parseTypeComponents);
  // then eval the template and stateMap of module
  const { parsedtemplete: evaledModuleTemplate, stateMap: evaledStateMap } =
    services.stateManager.mapValuesDeep(
      { parsedtemplete, stateMap: runtimeModule.spec.stateMap },
      ({ value }) => {
        if (typeof value === 'string') {
          return services.stateManager.maskedEval(value, true, moduleProperties);
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
          services.stateManager.store[id] = {
            ...services.stateManager.store[id],
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
