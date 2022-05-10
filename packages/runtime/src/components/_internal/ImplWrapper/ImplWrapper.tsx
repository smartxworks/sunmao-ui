import React from 'react';
import { ImplWrapperProps } from '../../../types';
import { shallowCompareArray } from '@sunmao-ui/shared';
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
      isEqual = shallowCompareArray(prevChildren, nextChildren);
    }
    return isEqual && prevComponent === nextComponent;
  }
);
