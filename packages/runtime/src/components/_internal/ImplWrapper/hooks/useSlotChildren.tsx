import React from 'react';
import { RuntimeComponentSchema } from '@sunmao-ui/core';
import { ImplWrapperProps } from '../../../../types';
import { ImplWrapper } from '../ImplWrapper';

export function useSlotElements(props: ImplWrapperProps) {
  const { component: c, childrenMap } = props;
  const childrenCache = new Map<RuntimeComponentSchema, React.ReactElement>();

  if (!childrenMap[c.id]) {
    return {};
  }
  const slotElements: Record<string, React.ReactElement[] | React.ReactElement> = {};
  for (const slot in childrenMap[c.id]) {
    const slotChildren = childrenMap[c.id][slot].map(child => {
      if (!childrenCache.get(child)) {
        const ele = <ImplWrapper key={child.id} {...props} component={child} />;
        childrenCache.set(child, ele);
      }
      return childrenCache.get(child)!;
    });

    slotElements[slot] = slotChildren.length === 1 ? slotChildren[0] : slotChildren;
  }
  return slotElements;
}
