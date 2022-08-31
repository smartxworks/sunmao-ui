import React from 'react';
import { SlotSpec } from '@sunmao-ui/core';
import { ImplWrapperProps, SlotsElements } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';
import { shallowCompare } from '@sunmao-ui/shared';

export function formatSlotKey(componentId: string, slot: string, key: string): string {
  /**
   * TODO: better naming strategy to avoid of conflicts
   */
  return `${componentId}_${slot}${key ? `_${key}` : ''}`;
}

export function getSlotElements(
  props: ImplWrapperProps & { children?: React.ReactNode }
): SlotsElements<Record<string, SlotSpec>> {
  const { component: c, childrenMap, services } = props;

  if (!childrenMap[c.id]) {
    return {};
  }
  const slotElements: SlotsElements<Record<string, SlotSpec>> = {};

  for (const slot in childrenMap[c.id]) {
    const slotChildren = childrenMap[c.id][slot].map(child => {
      return <ImplWrapper key={child.id} {...props} component={child} />;
    });

    slotElements[slot] = function getSlot(slotProps, slotFallback, key) {
      const slotKey = formatSlotKey(c.id, slot, key!);
      /**
       * The shallow compare is just a heuristic optimization,
       * feel free to improve it.
       */
      if (!shallowCompare(services.stateManager.slotStore[slotKey], slotProps)) {
        services.stateManager.slotStore[slotKey] = slotProps;
      }
      const slotContext = {
        renderSet: new Set(childrenMap[c.id][slot].map(child => child.id)),
        slotKey,
      };
      const children = slotChildren.map(child =>
        React.cloneElement(child, {
          slotContext,
        })
      );
      services.slotReceiver.emitter.emit(slotKey, slotFallback);
      return children;
    };
  }
  return slotElements;
}
