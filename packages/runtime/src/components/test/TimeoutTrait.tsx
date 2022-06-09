import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

const TimeoutTraitPropertiesSpec = Type.Object({
  value: Type.String(),
});

const TimeoutTrait: TraitImplFactory<Static<typeof TimeoutTraitPropertiesSpec>> = () => {
  // This trait will merge it property value in its state after 50ms
  return ({ value, mergeState }) => {
    setTimeout(() => {
      console.log('timeout: ', value);
      mergeState({ result: value });
    }, 50);

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
