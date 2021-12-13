import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../types/RuntimeSchema';

const HasInitializedMap = new Map<string, boolean>();

type KeyValue = { key: string; value: unknown };

const ArrayStateTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  key,
  initialValue,
  componentId,
  mergeState,
  subscribeMethods,
  services,
}) => {
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
    };
    subscribeMethods(methods);
    HasInitializedMap.set(hashId, true);
  }

  return {
    props: null,
  };
};

const PropsSchema = Type.Object({
  key: Type.String(),
  initialValue: Type.Optional(Type.Array(Type.Any())),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'arrayState',
      description: 'add array state to component',
    },
    spec: {
      properties: PropsSchema,
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
          name: 'reset',
        },
      ],
    },
  }),
  impl: ArrayStateTrait,
};
