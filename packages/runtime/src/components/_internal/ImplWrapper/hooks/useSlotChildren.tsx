import React from 'react';
import { RuntimeComponentSchema, SlotSchema } from '@sunmao-ui/core';
import { ImplWrapperProps, SlotsElements } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';

export function useSlotElements(
  props: ImplWrapperProps
): SlotsElements<Record<string, SlotSchema>> {
  const { component: c, childrenMap } = props;
  const childrenCache = new Map<RuntimeComponentSchema, React.ReactElement>();

  if (!childrenMap[c.id]) {
    return {};
  }
  const slotElements: SlotsElements<Record<string, SlotSchema>> = {};
  for (const slot in childrenMap[c.id]) {
    const slotChildren = childrenMap[c.id][slot].map(child => {
      if (!childrenCache.get(child)) {
        const ele = <ImplWrapper key={child.id} {...props} component={child} />;
        childrenCache.set(child, ele);
      }
      return childrenCache.get(child)!;
    });

    slotElements[slot] = slotProps => {
      return <>{slotChildren.map(child => React.cloneElement(child, { slotProps }))}</>;
    };
  }
  return slotElements;
}
