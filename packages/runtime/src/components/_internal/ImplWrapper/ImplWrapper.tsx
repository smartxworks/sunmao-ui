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
    let isComponentEqual = false;

    if (prevChildren && nextChildren) {
      isComponentEqual = shallowCompare(prevChildren, nextChildren);
    } else if (prevChildren === nextChildren) {
      isComponentEqual = true;
    }
    return isComponentEqual && prevComponent === nextComponent;
  }
);
