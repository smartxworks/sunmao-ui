import React from 'react';
import { ImplWrapperProps } from '../../../types';
import { shallowCompare } from '@sunmao-ui/shared';
import { UnmountImplWrapper } from './UnmountImplWrapper';

export const ImplWrapper = React.memo<ImplWrapperProps>(
  UnmountImplWrapper,
  (prevProps, nextProps) => {
    const prevChildren = prevProps.childrenMap[prevProps.component.id]?._grandChildren;
    const nextChildren = nextProps.childrenMap[nextProps.component.id]?._grandChildren;
    const prevComponent = prevProps.component;
    const nextComponent = nextProps.component;
    let isEqual = false;

    if (prevChildren && nextChildren) {
      isEqual = shallowCompare(prevChildren, nextChildren);
    } else if (prevChildren === nextChildren) {
      isEqual = true;
    }

    return (
      isEqual &&
      prevComponent === nextComponent &&
      // TODO: keep ImplWrapper memorized and get slot props from store
      shallowCompare(prevProps.slotProps, nextProps.slotProps) &&
      shallowCompare(prevProps.slotContext, nextProps.slotContext)
    );
  }
);
