import React from 'react';
import { SlotSchema } from '@sunmao-ui/core';
import { ImplWrapperProps, SlotsElements } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';

export function getSlotElements(
  props: ImplWrapperProps & { children?: React.ReactNode }
): SlotsElements<Record<string, SlotSchema>> {
  const { component: c, childrenMap } = props;

  if (!childrenMap[c.id]) {
    return {};
  }
  const slotElements: SlotsElements<Record<string, SlotSchema>> = {};
  for (const slot in childrenMap[c.id]) {
    const slotChildren = childrenMap[c.id][slot].map(child => {
      return <ImplWrapper key={child.id} {...props} component={child} />;
    });

    slotElements[slot] = function inlineSlot(slotProps) {
      return <>{slotChildren.map(child => React.cloneElement(child, { slotProps }))}</>;
    };
  }
  return slotElements;
}
