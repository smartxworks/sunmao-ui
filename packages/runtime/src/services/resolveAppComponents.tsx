import React from 'react';
import { RuntimeApplication } from '@sunmao-ui/core';
import { ContainerPropertySchema } from '../traits/core/slot';
import { Static } from '@sinclair/typebox';
import {
  ComponentParamsFromApp,
  UIServices,
  SlotComponentMap,
} from '../types/RuntimeSchema';
import { ImplWrapper } from './ImplWrapper';

export function resolveAppComponents(
  components: RuntimeApplication['spec']['components'],
  params: {
    services: UIServices;
    app?: RuntimeApplication;
  } & ComponentParamsFromApp
): {
  topLevelComponents: RuntimeApplication['spec']['components'];
  slotComponentsMap: SlotComponentMap;
} {
  const topLevelComponents: RuntimeApplication['spec']['components'] = [];
  const slotComponentsMap: SlotComponentMap = new Map();

  for (const c of components) {
    // handle component with slot trait
    const slotTrait = c.traits.find(t => t.parsedType.name === 'slot');
    if (slotTrait) {
      const { id, slot } = (
        slotTrait.properties as {
          container: Static<typeof ContainerPropertySchema>;
        }
      ).container;
      if (!slotComponentsMap.has(id)) {
        slotComponentsMap.set(id, new Map());
      }
      if (!slotComponentsMap.get(id)?.has(slot)) {
        slotComponentsMap.get(id)?.set(slot, []);
      }
      const component = React.forwardRef<HTMLDivElement, any>((props, ref) => (
        <ImplWrapper
          component={c}
          slotsMap={slotComponentsMap.get(c.id)}
          targetSlot={{ id, slot }}
          {...params}
          {...props}
          ref={ref}
        />
      ));
      component.displayName = c.parsedType.name;
      slotComponentsMap.get(id)?.get(slot)?.push({
        component,
        id: c.id,
      });
    }

    // if the component is neither assigned with slot trait nor route trait, consider it as a top level component
    !slotTrait && topLevelComponents.push(c);
  }

  return {
    topLevelComponents,
    slotComponentsMap,
  };
}
