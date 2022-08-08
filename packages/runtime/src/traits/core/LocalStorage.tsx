import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

const isEmpty = (value: unknown) => value === '' || value === null || value === undefined;

function setLocalStorage(key: string, value: unknown, options: LocalStorageItem['meta']) {
  const { versions = 0, expire = 0 } = options;
  if (isEmpty(value)) value = null;

  if (isNaN(expire) || isNaN(versions)) {
    throw new Error('Expire or Version must be number');
  }

  const data = {
    value,
    meta: {
      time: Date.now(),
      versions,
      ...(expire === 0 ? {} : { expire }),
    },
  };

  localStorage.setItem(key, JSON.stringify(data));
}

function removeStorage(key: string) {
  localStorage.removeItem(key);
}

// 1min
const DEFAULT_TIME_INTERVAL = 60 * 1000;

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

    let localItem;
    try {
      localItem = JSON.parse(value) as LocalStorageItem;
    } catch {
      // ignore
    }

    if (!localItem?.meta?.versions || versions > localItem?.meta?.versions) {
      setLocalStorage(key, defaultValue, { versions });
      return defaultValue;
    }

    const now = Date.now();
    if (localItem.meta.expire) {
      const expire = localItem.meta.expire * DEFAULT_TIME_INTERVAL;

      if (expire < now - (localItem.meta.time ?? now)) {
        removeStorage(key);
        return null;
      } else {
        setLocalStorage(key, localItem.value, {
          versions,
          expire: localItem.meta.expire,
        });
        return localItem.value;
      }
    } else {
      return localItem.value;
    }
  } catch (error) {
    return null;
  }
}

type LocalStorageItem = {
  value: any;
  meta: {
    time?: number;
    versions?: number;
    expire?: number;
  };
};

export const LocalStorageTraitPropertiesSpec = Type.Object({
  key: Type.String({
    title: 'Key',
  }),
  initialValue: Type.Any({
    title: 'Initial Value',
  }),
  versions: Type.Number({
    title: 'Versions',
  }),
  expire: Type.Number({
    title: 'Expire',
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
    ],
  },
})(() => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({
    key,
    versions,
    initialValue,
    expire,
    componentId,
    mergeState,
    subscribeMethods,
  }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    const setValue = (newValue: any) => {
      mergeState({
        [key]: newValue,
      });
      setLocalStorage(hashId, newValue, { versions, expire });
    };

    if (key) {
      if (!hasInitialized) {
        const value = getLocalStorage(hashId, initialValue, { versions, expire });
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
