import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from 'src/types/RuntimeSchema';

const HasInitializedMap = new Map<string, boolean>();

type KeyValue = { key: string; value: unknown };

const useStateTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  key,
  initialValue,
  componentId,
  mergeState,
  subscribeMethods,
}) => {
  const hashId = `#${componentId}@${key}`;
  const hasInitialized = HasInitializedMap.get(hashId);

  if (!hasInitialized) {
    mergeState({ [key]: initialValue });

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
    props: null,
  };
};

const PropsSchema = Type.Object({
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
      properties: PropsSchema,
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
  impl: useStateTrait,
};
