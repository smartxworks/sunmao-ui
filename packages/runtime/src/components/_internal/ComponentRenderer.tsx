import { Static } from '@sinclair/typebox';
import React, { useMemo } from 'react';
import { parseType, RuntimeApplication, RuntimeComponentSchema } from '@sunmao-ui/core';
import { ImplWrapper } from './ImplWrapper';
import { UIServices } from '../../types';
import { ModuleRenderSpec } from '@sunmao-ui/shared';
import { initStateAndMethod } from '../../utils/initStateAndMethod';

type Props = Static<typeof ModuleRenderSpec> & {
  evalScope?: Record<string, any>;
  services: UIServices;
  app: RuntimeApplication;
  traits: any;
};

export const ComponentRenderer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { type } = props;
  try {
    return <ComponentRendererContent {...props} ref={ref} />;
  } catch (e) {
    console.log(e);
    return <div ref={ref}>Cannot find Module {type}.</div>;
  }
});

const ComponentRendererContent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { properties, evalScope, services, app } = props;
  const evalOptions = { evalListItem: true, scopeObject: evalScope };
  const componentId = services.stateManager.maskedEval(props.id, evalOptions) as string;

  function evalObject<T extends Record<string, any>>(obj: T): T {
    return services.stateManager.mapValuesDeep({ obj }, ({ value }) => {
      if (typeof value === 'string') {
        return services.stateManager.maskedEval(value, evalOptions);
      }
      return value;
    }).obj;
  }

  // first eval the property, handlers, id of module
  const evaledProperties = evalObject(properties);
  const evaledTraits = evalObject(props.traits);

  const componentSchema: RuntimeComponentSchema = useMemo(() => {
    return {
      id: componentId,
      properties: evaledProperties,
      type: props.type,
      traits: evaledTraits,
      parsedType: parseType(props.type),
    };
  }, [componentId, evaledProperties, evaledTraits, props.type]);

  const result = useMemo(() => {
    // Must init components' state, otherwise store cannot listen these components' state changing
    initStateAndMethod(services.registry, services.stateManager, [componentSchema]);
    return (
      <ImplWrapper
        component={componentSchema}
        services={services}
        app={app}
        childrenMap={{}}
        isInModule={true}
      />
    );
  }, [services, componentSchema, app]);

  return (
    <div className="component-container" ref={ref}>
      {result}
    </div>
  );
});
