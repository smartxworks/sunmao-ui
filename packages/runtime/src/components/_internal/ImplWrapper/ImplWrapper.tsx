import React from 'react';
import { ImplWrapperProps } from '../../../types';
import { shallowCompareArray } from '../../../utils/shallowCompareArray';
import { ImplWrapperMain } from './ImplWrapperMain';

export const ImplWrapper = React.memo<ImplWrapperProps>(
  ImplWrapperMain,
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
