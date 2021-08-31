import { useEffect } from 'react';
import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';

const useStateTrait: TraitImplementation<{
  key: Static<typeof KeyPropertySchema>;
  initialValue: Static<typeof InitialValuePropertySchema>;
}> = ({ key, initialValue, mergeState, subscribeMethods }) => {
  useEffect(() => {
    mergeState({ [key]: initialValue });

    subscribeMethods({
      setValue(value) {
        mergeState({ [key]: value });
      },
      reset() {
        mergeState({ [key]: initialValue });
      },
    });
  }, []);

  return {
    props: null,
  };
};

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
          parameters: Type.Any(),
        },
        {
          name: 'reset',
        },
      ],
    },
  }),
  impl: useStateTrait,
};
