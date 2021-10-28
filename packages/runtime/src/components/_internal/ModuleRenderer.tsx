import { Static } from '@sinclair/typebox';
import React from 'react';
import { RuntimeApplication } from '@meta-ui/core';
import { MetaUIServices } from '../../types/RuntimeSchema';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';
import { parseTypeComponents } from '../chakra-ui/List';
import { resolveAppComponents } from '../../services/resolveAppComponents';
import { ImplWrapper } from '../../services/ImplWrapper';

export type RuntimeModuleSchema = {
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
  const { type, properties, handlers, evalScope, services, app } = props;
  const moduleTemplate = services.registry.getModuleByType(type);
  const parsedtemplete = moduleTemplate.spec.components.map(parseTypeComponents);

  const { properties: moduleProperties, handlers: modulesHandlers } =
    services.stateManager.mapValuesDeep({ properties, handlers }, ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, true, evalScope);
      }
      return value;
    });

  const evaledModuleTemplate = services.stateManager.mapValuesDeep(
    { template: parsedtemplete },
    ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, true, moduleProperties);
      }
      return value;
    }
  ).template;

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
