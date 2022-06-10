import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

const TimeoutTraitPropertiesSpec = Type.Object({
  value: Type.String(),
  timeout: Type.Optional(Type.Number()),
});

const TimeoutTrait: TraitImplFactory<Static<typeof TimeoutTraitPropertiesSpec>> = () => {
  return ({ value, mergeState, timeout }) => {
    setTimeout(() => {
      mergeState({ result: value });
    }, timeout || 0);

    return {
      props: null,
    };
  };
};

export default {
  ...createTrait({
    version: 'test/v1',
    metadata: {
      name: 'timeout',
      description: 'for test',
    },
    spec: {
      properties: TimeoutTraitPropertiesSpec,
      methods: [],
      state: Type.Object({
        result: Type.String(),
      }),
    },
  }),
  factory: TimeoutTrait,
};
