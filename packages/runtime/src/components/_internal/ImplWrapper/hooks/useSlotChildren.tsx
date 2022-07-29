import React from 'react';
import { SlotSpec } from '@sunmao-ui/core';
import { ImplWrapperProps, SlotsElements } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';
import { shallowCompare } from '@sunmao-ui/shared';
import { slotReceiver } from '../SlotReciver';

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
      /**
       * TODO: better naming strategy to avoid of conflicts
       */
      const slotKey = `${c.id}_${slot}${key ? `_${key}` : ''}`;
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
      slotReceiver.emitter.emit(slotKey, slotFallback);
      return children;
    };
  }
  return slotElements;
}
