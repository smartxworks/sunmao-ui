import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

const isEmpty = (value: unknown) => value === '' || value === null || value === undefined;

type LocalStorageItem = {
  value: any;
  meta: {
    versions?: number;
  };
};

function setLocalStorage(key: string, value: unknown, options: LocalStorageItem['meta']) {
  const { versions = 0 } = options;
  if (isEmpty(value)) value = null;

  if (isNaN(versions)) {
    throw new Error('Versions must be number');
  }

  const data = {
    value,
    meta: {
      versions,
    },
  };

  localStorage.setItem(key, JSON.stringify(data));
}

function removeStorage(key: string) {
  localStorage.removeItem(key);
}

function getLocalStorage(
  key: string,
  defaultValue = null,
  options: LocalStorageItem['meta']
) {
  const { versions = 0 } = options;
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    let localStorageItem;
    try {
      localStorageItem = JSON.parse(value) as LocalStorageItem;
    } catch {
      // ignore
    }

    if (!localStorageItem?.meta) {
      setLocalStorage(key, localStorageItem, { versions });
      return localStorageItem;
    }

    if (versions > localStorageItem.meta.versions!) {
      setLocalStorage(key, defaultValue, { versions });
      return defaultValue;
    } else {
      return localStorageItem.value;
    }
  } catch (error) {
    return null;
  }
}

export const LocalStorageTraitPropertiesSpec = Type.Object({
  key: Type.String({
    title: 'Key',
  }),
  initialValue: Type.Any({
    title: 'Initial Value',
  }),
  versions: Type.Number({
    title: 'Versions',
    description:
      'The value of localStorage will only be reset to initial value if the versions becomes larger',
  }),
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
      {
        name: 'clear',
        parameters: {},
      },
    ],
  },
})(() => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({ key, versions, initialValue, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    const setValue = (newValue: any) => {
      mergeState({
        [key]: newValue,
      });
      setLocalStorage(hashId, newValue, { versions });
    };

    if (key) {
      if (!hasInitialized) {
        const value = getLocalStorage(hashId, initialValue, { versions }) ?? initialValue;
        setValue(value);

        subscribeMethods({
          setValue: ({ value: newValue }: { value: any }) => {
            setValue(newValue);
          },
          removeItem: () => {
            removeStorage(hashId);
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
