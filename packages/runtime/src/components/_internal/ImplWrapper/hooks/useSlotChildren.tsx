import React from 'react';
import { SlotSpec } from '@sunmao-ui/core';
import { ImplWrapperProps, SlotsElements } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';

export function getSlotElements(
  props: ImplWrapperProps & { children?: React.ReactNode }
): SlotsElements<Record<string, SlotSpec>> {
  const { component: c, childrenMap } = props;

  if (!childrenMap[c.id]) {
    return {};
  }
  const slotElements: SlotsElements<Record<string, SlotSpec>> = {};
  for (const slot in childrenMap[c.id]) {
    const slotChildren = childrenMap[c.id][slot].map(child => {
      return <ImplWrapper key={child.id} {...props} component={child} />;
    });

    slotElements[slot] = function getSlot(slotProps, slotFallback) {
      const slotContext = {
        renderSet: new Set(childrenMap[c.id][slot].map(child => child.id)),
        parentId: c.id,
        slotProps: JSON.stringify(slotProps),
        fallback: slotFallback,
      };
      const children = slotChildren.map(child =>
        React.cloneElement(child, {
          slotProps,
          slotContext,
        })
      );
      return children;
    };
  }
  return slotElements;
}
