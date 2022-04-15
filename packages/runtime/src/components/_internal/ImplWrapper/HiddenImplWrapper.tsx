import React from 'react';
import { render } from 'react-dom';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { useRuntimeFunctions } from './useRuntimeFunctions';

export const HiddenImplWrapper: React.FC<ImplWrapperProps> = props => {
  const { component: c, services, children } = props;
  const { stateManager } = services;
  const { executeTrait } = useRuntimeFunctions(props);

  const hiddenTraits = c.traits.filter(t => t.type === 'core/v1/hidden');
  if (hiddenTraits.length > 0) {
    const results: TraitResult<string, string>[] = hiddenTraits.map(t => {
      const properties = stateManager.deepEval(t.properties);
      return executeTrait(t, properties);
    });
    if (results.some(result => result.unmount)) {
      // Every component's state is initailize in initStateAnd Method.
      // So if if it should not render, we should remove it from store.
      delete stateManager.store[c.id];
      return null;
    }
  }

  return <>{children}</>;
};
