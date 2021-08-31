import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';
import { stateStore } from '../../store';

const HasInitializedMap = new Map<string, boolean>();

type KeyValue = { key: string; value: unknown };

const useStateTrait: TraitImplementation<{
  key: Static<typeof KeyPropertySchema>;
  initialValue: Static<typeof InitialValuePropertySchema>;
}> = ({ key, initialValue, componentId, mergeState, subscribeMethods }) => {
  const hashId = `#${componentId}@${key}`;
  let hasInitialized = HasInitializedMap.get(hashId);

  if (!hasInitialized) {
    mergeState({ [key]: initialValue });

    const upperCaseKey = capitalizeFirstLetter(key);
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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const KeyPropertySchema = Type.String();
const InitialValuePropertySchema = Type.Any();

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'state',
      description: 'add state to component',
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
