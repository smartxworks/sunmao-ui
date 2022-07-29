import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { ImplWrapperMain } from './ImplWrapperMain';
import { useRuntimeFunctions } from './hooks/useRuntimeFunctions';
import { initSingleComponentState } from '../../../utils/initStateAndMethod';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { watch } from '../../..';
import { Receiver } from './SlotReciver';

export const UnmountImplWrapper = React.forwardRef<HTMLDivElement, ImplWrapperProps>(
  function UnmountImplWrapper(props, ref) {
    const { component: c, services, slotContext } = props;
    const { stateManager, registry } = services;
    const { executeTrait } = useRuntimeFunctions(props);
    const renderCount = useRef(0);
    renderCount.current++;

    const slotKey = slotContext?.slotKey || '';

    const unmountTraits = useMemo(
      () =>
        c.traits.filter(
          t => registry.getTraitByType(t.type).metadata.annotations?.beforeRender
        ),
      [c.traits, registry]
    );

    const [isHidden, setIsHidden] = useState(() => {
      const results: TraitResult<ReadonlyArray<string>, ReadonlyArray<string>>[] =
        unmountTraits.map(t => {
          const properties = stateManager.deepEval(t.properties, {
            slotKey,
          });
          return executeTrait(t, properties);
        });
      return results.some(result => result.unmount);
    });

    const traitChangeCallback = useCallback(
      (trait: RuntimeTraitSchema, properties: Record<string, unknown>) => {
        const result = executeTrait(trait, properties);
        const prevIsHidden = isHidden;
        setIsHidden(!!result.unmount);
        if (result.unmount) {
          // Every component's state is initialized in initStateAnd Method.
          // So if if it should not render, we should remove it from store.

          /**
           * prevIsHidden: Only clear the store when the component is not
           * hidden before this check.
           *
           * renderCount: Currently we call initStateAndMethod to setup the
           * state store, and let here to teardown the hidden components'
           * state. If a component is hidden forever, it still need to teardown
           * at the first time it rendered.
           * Not a perfect solution, and we should have better lifecycle
           * management for the state store.
           */
          if (!prevIsHidden || renderCount.current === 1) {
            delete stateManager.store[c.id];
          }
        }
      },
      [c.id, executeTrait, stateManager, isHidden]
    );

    useEffect(() => {
      const stops: ReturnType<typeof watch>[] = [];
      if (unmountTraits.length > 0) {
        unmountTraits.forEach(t => {
          const { result, stop } = stateManager.deepEvalAndWatch(
            t.properties,
            newValue => traitChangeCallback(t, newValue.result),
            {
              slotKey,
            }
          );
          traitChangeCallback(t, result);
          stops.push(stop);
        });
      }
      return () => {
        stops.forEach(stop => stop());
      };
    }, [c, executeTrait, unmountTraits, stateManager, traitChangeCallback, slotKey]);

    // If a component is unmount, its state would be removed.
    // So if it mount again, we should init its state again.
    if (!isHidden && !stateManager.store[c.id]) {
      initSingleComponentState(registry, stateManager, c);
    }

    if (isHidden && slotContext) {
      slotContext.renderSet.delete(c.id);
      if (slotContext.renderSet.size === 0) {
        return <Receiver slotKey={slotContext.slotKey} />;
      }
    }
    return !isHidden ? <ImplWrapperMain {...props} ref={ref} /> : null;
  }
);
