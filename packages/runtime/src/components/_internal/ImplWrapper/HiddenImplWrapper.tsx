import React, { useEffect, useMemo, useState } from 'react';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { ImplWrapperMain } from './ImplWrapperMain';
import { useRuntimeFunctions } from './hooks/useRuntimeFunctions';

export const HiddenImplWrapper = React.forwardRef<HTMLDivElement, ImplWrapperProps>(
  (props, ref) => {
    const { component: c, services } = props;
    const { stateManager } = services;
    const { executeTrait } = useRuntimeFunctions(props);
    const hiddenTraits = useMemo(
      () => c.traits.filter(t => t.type === 'core/v1/hidden'),
      [c.traits]
    );
    const [isHidden, setIsHidden] = useState(() => {
      const results: TraitResult<string, string>[] = hiddenTraits.map(t => {
        const properties = stateManager.deepEval(t.properties);
        return executeTrait(t, properties);
      });
      return results.some(result => result.unmount);
    });

    useEffect(() => {
      if (hiddenTraits.length > 0) {
        hiddenTraits.map(t => {
          const properties = stateManager.deepEvalAndWatch(t.properties, newV => {
            console.log('get hidden results', newV.result.hidden);
            const result = executeTrait(t, newV.result);
            setIsHidden(!!result.unmount);
            if (result.unmount) {
              //   // Every component's state is initialize in initStateAnd Method.
              //   // So if if it should not render, we should remove it from store.
              delete stateManager.store[c.id];
            }
          });
          return executeTrait(t, properties);
        });
      }
    }, [c, executeTrait, hiddenTraits, stateManager]);

    return !isHidden ? <ImplWrapperMain {...props} ref={ref} /> : null;
  }
);
