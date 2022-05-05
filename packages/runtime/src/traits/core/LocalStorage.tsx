import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

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

export const LocalStorageTraitPropertiesSpec = Type.Object({
  key: Type.String(),
  initialValue: Type.Any(),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.LocalStorage,
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
});
