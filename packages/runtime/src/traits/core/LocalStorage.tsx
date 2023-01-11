import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

const isEmpty = (value: unknown) => value === '' || value === null || value === undefined;

type LocalStorageItem = {
  value: any;
  meta: {
    version?: number;
  };
};

function setLocalStorage(key: string, value: unknown, options: LocalStorageItem['meta']) {
  const { version = 0 } = options;

  if (isNaN(version)) {
    throw new Error('Version must be a number');
  }

  const data = {
    value: isEmpty(value) ? null : value,
    meta: {
      version,
    },
  };

  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(
  key: string,
  defaultValue = null,
  options: LocalStorageItem['meta'] = {}
) {
  const { version = 0 } = options;
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return { value: defaultValue, version };
    }

    let localStorageItem;
    try {
      localStorageItem = JSON.parse(value) as LocalStorageItem;
    } catch {
      // ignore
    }

    if (!localStorageItem?.meta) {
      return { value: localStorageItem, version };
    }

    if (version > localStorageItem.meta.version!) {
      return { value: defaultValue, version };
    } else {
      return { value: localStorageItem.value, version: localStorageItem.meta.version };
    }
  } catch (error) {
    return { value: defaultValue, version };
  }
}

export const LocalStorageTraitPropertiesSpec = Type.Object({
  key: Type.String({
    title: 'Key',
    default: 'value',
  }),
  initialValue: Type.Any({
    title: 'Initial Value',
  }),
  version: Type.Number({
    title: 'Version',
    description:
      'The value of localStorage will only be reset to initial value if the version becomes larger',
  }),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.LocalStorage,
    description: 'localStorage trait',
    isDataSource: true,
  },
  spec: {
    properties: LocalStorageTraitPropertiesSpec,
    state: Type.Object({
      version: Type.Number(),
    }),
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

  return ({ key, version, initialValue, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    const setValue = (newValue: any, version?: number) => {
      const storageItem = getLocalStorage(hashId);
      mergeState({
        [key]: newValue,
        version: version || storageItem.version,
      });
      setLocalStorage(hashId, newValue, { version: version || storageItem.version });
    };

    if (key) {
      if (!hasInitialized) {
        const storageItem = getLocalStorage(hashId, initialValue, { version });
        setValue(storageItem?.value || initialValue, storageItem.version);

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
