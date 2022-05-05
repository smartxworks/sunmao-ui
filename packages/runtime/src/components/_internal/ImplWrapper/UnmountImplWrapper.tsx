import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { ImplWrapperMain } from './ImplWrapperMain';
import { useRuntimeFunctions } from './hooks/useRuntimeFunctions';
import { initSingleComponentState } from '../../../utils/initStateAndMethod';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { watch } from '../../..';

export const UnmountImplWrapper = React.forwardRef<HTMLDivElement, ImplWrapperProps>(
  (props, ref) => {
    const { component: c, services } = props;
    const { stateManager, registry } = services;
    const { executeTrait } = useRuntimeFunctions(props);

    const unmountTraits = useMemo(
      () =>
        c.traits.filter(
          t => registry.getTraitByType(t.type).metadata.annotations?.beforeRender
        ),
      [c.traits, registry]
    );

    const [isHidden, setIsHidden] = useState(() => {
      const results: TraitResult<string, string>[] = unmountTraits.map(t => {
        const properties = stateManager.deepEval(t.properties, {
          scopeObject: { $slot: props.slotProps },
        });
        return executeTrait(t, properties);
      });
      return results.some(result => result.unmount);
    });

    const traitChangeCallback = useCallback(
      (trait: RuntimeTraitSchema, properties: Record<string, unknown>) => {
        const result = executeTrait(trait, properties);
        setIsHidden(!!result.unmount);
        if (result.unmount) {
          // Every component's state is initialized in initStateAnd Method.
          // So if if it should not render, we should remove it from store.
          delete stateManager.store[c.id];
        }
      },
      [c.id, executeTrait, stateManager]
    );

    useEffect(() => {
      const stops: ReturnType<typeof watch>[] = [];
      if (unmountTraits.length > 0) {
        unmountTraits.forEach(t => {
          const { result, stop } = stateManager.deepEvalAndWatch(
            t.properties,
            newValue => traitChangeCallback(t, newValue.result),
            {
              scopeObject: { $slot: props.slotProps },
            }
          );
          traitChangeCallback(t, result);
          stops.push(stop);
        });
      }
      return () => {
        stops.forEach(stop => stop());
      };
    }, [
      c,
      executeTrait,
      unmountTraits,
      stateManager,
      traitChangeCallback,
      props.slotProps,
    ]);

    // If a component is unmount, its state would be removed.
    // So if it mount again, we should init its state again.
    if (!isHidden && !stateManager.store[c.id]) {
      initSingleComponentState(registry, stateManager, c);
    }

    return !isHidden ? <ImplWrapperMain {...props} ref={ref} /> : null;
  }
);
