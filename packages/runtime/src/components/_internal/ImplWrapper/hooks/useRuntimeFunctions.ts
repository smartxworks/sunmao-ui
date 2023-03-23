import { useCallback } from 'react';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { ImplWrapperProps } from '../../../../types';
import { merge } from 'lodash';
import { HandlerMap } from '../../../../services/handler';
import { DebugLoggerType } from '../../../../services/debugger';

export function useRuntimeFunctions(props: ImplWrapperProps) {
  const { component: c, services, slotContext } = props;
  const { stateManager, registry, globalHandlerMap } = services;
  const slotKey = slotContext?.slotKey || '';

  const mergeState = useCallback(
    (partial: any) => {
      stateManager.store[c.id] = { ...stateManager.store[c.id], ...partial };
      // Logging state change debug info
      services.apiService.send('mergeState', {
        type: DebugLoggerType.MERGE_STATE,
        id: c.id,
        parameters: partial,
      });
    },
    [c.id, services.apiService, stateManager.store]
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
        slotKey,
      });
    },
    [c.id, mergeState, registry, services, slotKey, subscribeMethods]
  );
  return {
    mergeState,
    subscribeMethods,
    executeTrait,
  };
}
