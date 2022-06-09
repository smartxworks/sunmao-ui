import { useCallback } from 'react';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { ImplWrapperProps } from '../../../../types';
import { merge } from 'lodash';
import { HandlerMap } from '../../../../services/handler';

export function useRuntimeFunctions(props: ImplWrapperProps) {
  const { component: c, services, slotProps, evalListItem } = props;
  const { stateManager, registry, globalHandlerMap } = services;

  const mergeState = useCallback(
    (partial: any) => {
      stateManager.store[c.id] = { ...stateManager.store[c.id], ...partial };
    },
    [c.id, stateManager.store]
  );
  const subscribeMethods = useCallback(
    (map: HandlerMap) => {
      const oldMap = globalHandlerMap.get(c.id);
      globalHandlerMap.set(c.id, merge(oldMap, map));
    },
    [c.id, globalHandlerMap]
  );

  const executeTrait = useCallback(
    (trait: RuntimeTraitSchema, traitProperty: RuntimeTraitSchema['properties']) => {
      const tImpl = registry.getTrait(
        trait.parsedType.version,
        trait.parsedType.name
      ).impl;
      return tImpl({
        ...traitProperty,
        trait,
        componentId: c.id,
        mergeState,
        subscribeMethods,
        services,
        slotProps,
        evalListItem,
      });
    },
    [c.id, evalListItem, mergeState, registry, services, slotProps, subscribeMethods]
  );
  return {
    mergeState,
    subscribeMethods,
    executeTrait,
  };
}
