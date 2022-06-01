import { RuntimeFunctions } from '@sunmao-ui/runtime';
import { useState, useEffect } from 'react';
import { SlotSpec } from '@sunmao-ui/core';

export const useStateValue = <T, TMethods, TSlots extends Record<string, SlotSpec>>(
  defaultValue: T,
  mergeState?: RuntimeFunctions<Record<string, T>, TMethods, TSlots>['mergeState'],
  updateWhenDefaultValueChanges?: boolean,
  key = 'value'
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (mergeState) {
      mergeState({ [key]: defaultValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateWhenDefaultValueChanges && mergeState) {
      setValue(defaultValue);
      mergeState({ [key]: defaultValue });
    }
  }, [defaultValue, updateWhenDefaultValueChanges, mergeState, key]);

  return [value, setValue];
};
