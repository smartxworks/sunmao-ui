import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

type KeyValue = { key: string; value: unknown };

const StateTraitFactory: TraitImplFactory<Static<typeof PropsSpec>> = () => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({ key, initialValue, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    if (!hasInitialized) {
      const methods = {
        setValue({ key, value }: KeyValue) {
          mergeState({ [key]: value });
        },
        resetValue({ key }: KeyValue) {
          mergeState({ [key]: initialValue });
        },
      };
      subscribeMethods(methods);
      HasInitializedMap.set(hashId, true);
    }

    return {
      props: {
        componentDidMount: [
          () => {
            console.log('merge state');
            mergeState({ [key]: initialValue });
          },
        ],
        unmountHooks: [
          () => {
            HasInitializedMap.delete(hashId);
          },
        ],
      },
    };
  };
};

const PropsSpec = Type.Object({
  key: Type.String(),
  initialValue: Type.Any(),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'state',
      description: 'add state to component',
    },
    spec: {
      properties: PropsSpec,
      state: Type.Any(),
      methods: [
        {
          name: 'setValue',
          parameters: Type.Object({
            key: Type.String(),
            value: Type.Any(),
          }),
        },
        {
          name: 'reset',
        },
      ],
    },
  }),
  factory: StateTraitFactory,
};
