import { RuntimeFunctions } from '@sunmao-ui/runtime';
import { useState, useEffect } from 'react';

export const useStateValue = <T>(
  defaultValue: T,
  mergeState?: RuntimeFunctions<Record<string, T>, any>['mergeState'],
  updateWhenDefaultValueChanges?: boolean,
  key = 'value'
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (mergeState) {
      mergeState({ [key]: defaultValue });
    }
  }, []);

  useEffect(() => {
    if (updateWhenDefaultValueChanges && mergeState) {
      setValue(defaultValue);
      mergeState({ [key]: defaultValue });
    }
  }, [defaultValue, updateWhenDefaultValueChanges, mergeState]);

  return [value, setValue];
};
