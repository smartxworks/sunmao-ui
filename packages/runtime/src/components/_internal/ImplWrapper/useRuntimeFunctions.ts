import { useCallback, useRef } from 'react';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { ImplWrapperProps } from '../../../types';

export function useRuntimeFunctions(props: ImplWrapperProps) {
  const { component: c, services } = props;
  const { stateManager, registry, globalHandlerMap } = services;
  const handlerMapRef = useRef(globalHandlerMap.get(c.id)!);

  const mergeState = useCallback(
    (partial: any) => {
      stateManager.store[c.id] = { ...stateManager.store[c.id], ...partial };
    },
    [c.id, stateManager.store]
  );
  const subscribeMethods = useCallback(
    (map: any) => {
      handlerMapRef.current = { ...handlerMapRef.current, ...map };
      globalHandlerMap.set(c.id, handlerMapRef.current);
    },
    [c.id, globalHandlerMap, handlerMapRef]
  );

  const executeTrait = useCallback(
    (trait: RuntimeTraitSchema, traitProperty: RuntimeTraitSchema['properties']) => {
      console.log('执行了trait', trait.type);
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
      });
    },
    [c.id, mergeState, registry, services, subscribeMethods]
  );
  return {
    mergeState,
    subscribeMethods,
    executeTrait,
    handlerMapRef
  };
}
