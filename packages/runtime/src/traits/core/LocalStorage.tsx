import { Static, Type } from '@sinclair/typebox';
import { createTrait } from '@sunmao-ui/core';
import { isEqual } from 'lodash';
import { TraitImplFactory } from '../../types';

function getLocalStorageValue(key: string) {
  try {
    const json = localStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    }
    return '';
  } catch (error) {
    return '';
  }
}

const PropsSchema = Type.Object({
  key: Type.String(),
  value: Type.Any(),
});

const LocalStorageTraitFactory: TraitImplFactory<Static<typeof PropsSchema>> = () => {
  const HasInitializedMap = new Map<string, boolean>();
  const PrevValueCache: Record<string, unknown> = {};

  return ({ key, value, componentId, mergeState }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    if (key) {
      if (!hasInitialized) {
        PrevValueCache[key] = getLocalStorageValue(hashId);
        mergeState({
          [key]: PrevValueCache[key],
        });
        HasInitializedMap.set(hashId, true);
      } else {
        if (!isEqual(PrevValueCache[key], value)) {
          PrevValueCache[key] = value;
          mergeState({
            [key]: value,
          });
          localStorage.setItem(hashId, JSON.stringify(value));
        }
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
      properties: PropsSchema,
      state: Type.Object({}),
      methods: [],
    },
  }),
  factory: LocalStorageTraitFactory,
};
