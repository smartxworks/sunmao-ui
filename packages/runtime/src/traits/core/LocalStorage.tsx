import { Static, Type } from '@sinclair/typebox';
import { createTrait } from '@sunmao-ui/core';
import { TraitImplFactory } from '../../types';

function getLocalStorageValue(key: string) {
  try {
    const json = localStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  } catch (error) {
    return null;
  }
}

const PropsSpec = Type.Object({
  key: Type.String(),
  initialValue: Type.Any(),
});

const LocalStorageTraitFactory: TraitImplFactory<Static<typeof PropsSpec>> = () => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({ key, initialValue, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    const setValue = (newValue: any) => {
      mergeState({
        [key]: newValue,
      });
      localStorage.setItem(hashId, JSON.stringify(newValue));
    };

    if (key) {
      if (!hasInitialized) {
        const value = getLocalStorageValue(hashId) ?? initialValue;
        setValue(value);

        subscribeMethods({
          setValue: ({ value: newValue }: { value: any }) => {
            setValue(newValue);
          },
        });
        HasInitializedMap.set(hashId, true);
      }
    }

    return {
      props: null,
    };
  };
};

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'localStorage',
      description: 'localStorage trait',
    },
    spec: {
      properties: PropsSpec,
      state: Type.Object({}),
      methods: [
        {
          name: 'setValue',
          parameters: Type.Object({
            value: Type.Any(),
          }),
        },
      ],
    },
  }),
  factory: LocalStorageTraitFactory,
};
