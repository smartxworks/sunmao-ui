import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';
import { stateStore } from '../../store';

const HasInitializedMap = new Map<string, boolean>();

type KeyValue = { key: string; value: unknown };

const ArrayStateTrait: TraitImplementation<{
  key: Static<typeof KeyPropertySchema>;
  initialValue: Static<typeof InitialValuePropertySchema>;
}> = ({ key, initialValue, componentId, mergeState, subscribeMethods }) => {
  const hashId = `#${componentId}@${key}`;
  const hasInitialized = HasInitializedMap.get(hashId);

  if (!hasInitialized) {
    mergeState({ [key]: initialValue });

    const methods = {
      setArray({ key, value }: KeyValue) {
        mergeState({ [key]: value });
      },
      deleteItemByIndex({ key, index }: { key: string; index: number }) {
        const _arr = [...stateStore[componentId][key]];
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
        const _arr = [...stateStore[componentId][key]].filter(item => {
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

const KeyPropertySchema = Type.String();
const InitialValuePropertySchema = Type.Array(Type.Any());

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'arrayState',
      description: 'add array state to component',
    },
    spec: {
      properties: [
        {
          name: 'key',
          ...KeyPropertySchema,
        },
        {
          name: 'initialValue',
          ...InitialValuePropertySchema,
        },
      ],
      state: Type.Any(),
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
