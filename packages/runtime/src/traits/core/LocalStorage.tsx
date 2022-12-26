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

  if (isNaN(versions)) {
    throw new Error('Versions must be a number');
  }

  const data = {
    value: isEmpty(value) ? null : value,
    meta: {
      versions,
    },
  };

  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(
  key: string,
  defaultValue = null,
  options: LocalStorageItem['meta'] = {}
) {
  const { versions = 0 } = options;
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return { value: defaultValue, versions };
    }

    let localStorageItem;
    try {
      localStorageItem = JSON.parse(value) as LocalStorageItem;
    } catch {
      // ignore
    }

    if (!localStorageItem?.meta) {
      return { value: localStorageItem, versions };
    }

    if (versions > localStorageItem.meta.versions!) {
      return { value: defaultValue, versions };
    } else {
      return { value: localStorageItem.value, versions: localStorageItem.meta.versions };
    }
  } catch (error) {
    return { value: defaultValue, versions };
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
    state: Type.Object({
      value: Type.Any(),
      versions: Type.Number(),
    }),
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

    const setValue = (newValue: any, versions?: number) => {
      const storageItem = getLocalStorage(hashId);
      mergeState({
        [key]: newValue,
        versions: versions || storageItem.versions,
      });
      setLocalStorage(hashId, newValue, { versions: versions || storageItem.versions });
    };

    if (key) {
      if (!hasInitialized) {
        const storageItem = getLocalStorage(hashId, initialValue, { versions });
        setValue(storageItem?.value, storageItem.versions);

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
