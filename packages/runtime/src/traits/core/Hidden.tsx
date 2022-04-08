import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

const HiddenTraitFactory: TraitImplFactory<Static<typeof PropsSpec>> = () => {
  return ({ hidden, visually }) => {
    if (visually) {
      return {
        props: {
          customStyle: {
            content: hidden ? 'display: none' : '',
          },
        },
      };
    }

    return {
      props: {},
      unmount: hidden,
    };
  };
};

const PropsSpec = Type.Object({
  hidden: Type.Boolean(),
  visually: Type.Optional(Type.Boolean()),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'hidden',
      description: 'render component with condition',
    },
    spec: {
      properties: PropsSpec,
      state: {},
      methods: [],
    },
  }),
  factory: HiddenTraitFactory,
};
