import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

type KeyValue = { key: string; value: unknown };

export const ArrayStateTraitPropertiesSpec = Type.Object({
  key: Type.String({ default: 'value' }),
  initialValue: Type.Optional(Type.Array(Type.Any())),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.ArrayState,
    description: 'add array state to component',
  },
  spec: {
    properties: ArrayStateTraitPropertiesSpec,
    methods: [
      {
        name: 'setArray',
        parameters: Type.Object({
          key: Type.String(),
          value: Type.Array(Type.Any()),
        }),
      },
      {
        name: 'deleteItemByIndex',
        parameters: Type.Object({
          key: Type.String(),
          index: Type.Integer(),
        }),
      },
      {
        name: 'deleteItemById',
        parameters: Type.Object({
          key: Type.String(),
          itemIdKey: Type.String(),
          itemId: Type.String(),
        }),
      },
      {
        name: 'pushItem',
        parameters: Type.Object({
          key: Type.String(),
          item: Type.Any(),
        }),
      },
      {
        name: 'modifyItemById',
        parameters: Type.Object({
          key: Type.String(),
          itemIdKey: Type.String(),
          itemId: Type.String(),
          newItem: Type.Any(),
        }),
      },
      {
        name: 'reset',
      },
    ],
    state: {},
  },
})(() => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({ key, initialValue, componentId, mergeState, subscribeMethods, services }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    if (!hasInitialized) {
      mergeState({ [key]: initialValue || [] });

      const methods = {
        setArray({ key, value }: KeyValue) {
          mergeState({ [key]: value });
        },
        deleteItemByIndex({ key, index }: { key: string; index: number }) {
          const _arr = [...services.stateManager.store[componentId][key]];
          _arr.splice(index, 1);
          mergeState({ [key]: _arr });
        },
        deleteItemById({
          key,
          itemIdKey,
          itemId,
        }: {
          key: string;
          itemIdKey: string;
          itemId: string;
        }) {
          const _arr = [...services.stateManager.store[componentId][key]].filter(item => {
            return item[itemIdKey] !== itemId;
          });
          mergeState({ [key]: _arr });
        },
        pushItem({ item, key }: { key: string; item: any }) {
          const _arr = [...services.stateManager.store[componentId][key], item];
          mergeState({ [key]: _arr });
        },
        modifyItemById({
          key,
          itemIdKey,
          itemId,
          newItem,
        }: {
          key: string;
          itemIdKey: string;
          itemId: string;
          newItem: any;
        }) {
          const _arr = [...services.stateManager.store[componentId][key]];
          const index = _arr.findIndex(v => v[itemIdKey] === itemId);
          _arr.splice(index, 1, newItem);
          mergeState({ [key]: _arr });
        },
      };
      subscribeMethods(methods);
      HasInitializedMap.set(hashId, true);
    }

    return {
      props: null,
    };
  };
});
