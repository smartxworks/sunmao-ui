import { Type } from '@sinclair/typebox';
import { isEqual } from 'lodash';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, LOCAL_STORAGE_TRAIT_NAME } from '@sunmao-ui/shared';

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

export const LocalStorageTraitPropertiesSpec = Type.Object({
  key: Type.String(),
  value: Type.Any(),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: LOCAL_STORAGE_TRAIT_NAME,
    description: 'localStorage trait',
  },
  spec: {
    properties: LocalStorageTraitPropertiesSpec,
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
})(() => {
  const HasInitializedMap = new Map<string, boolean>();
  const PrevValueCache: Record<string, unknown> = {};

  return ({ key, value, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    const setValue = (newValue: any) => {
      PrevValueCache[key] = newValue;
      mergeState({
        [key]: newValue,
      });
      localStorage.setItem(hashId, JSON.stringify(newValue));
    };

    if (key) {
      if (!hasInitialized) {
        PrevValueCache[key] = getLocalStorageValue(hashId);
        mergeState({
          [key]: PrevValueCache[key],
        });
        subscribeMethods({
          setValue: ({ value: newValue }: { value: any }) => {
            setValue(newValue);
          },
        });
        HasInitializedMap.set(hashId, true);
      } else {
        if (!isEqual(PrevValueCache[key], value)) {
          setValue(value);
        }
      }
    }

    return {
      props: null,
    };
  };
});
