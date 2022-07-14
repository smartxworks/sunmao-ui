import { RuntimeFunctions } from '@sunmao-ui/runtime';
import { useState, useEffect } from 'react';
import { SlotSpec } from '@sunmao-ui/core';

export const useStateValue = <
  T,
  TMethods = any,
  TSlots extends Record<string, SlotSpec> = Record<string, SlotSpec>
>(
  defaultValue: T,
  mergeState?: RuntimeFunctions<Record<string, T>, TMethods, TSlots>['mergeState'],
  updateWhenDefaultValueChanges?: boolean,
  key = 'value',
  bindValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (mergeState) {
      mergeState({ [key]: defaultValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bindValue !== undefined && mergeState) {
      setValue(bindValue);
      mergeState({ [key]: bindValue });
    }
  }, [bindValue, updateWhenDefaultValueChanges, mergeState, key]);

  return [value, setValue];
};
