import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from 'src/types/RuntimeSchema';

const useHiddenTrait: TraitImplementation<Static<typeof PropsSchema>> = ({ hidden }) => {
  return {
    props: {
      customStyle: {
        content: hidden ? 'display: none' : '',
      },
    },
  };
};

const PropsSchema = Type.Object({
  hidden: Type.Boolean(),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'hidden',
      description: 'render component with condition',
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [],
    },
  }),
  impl: useHiddenTrait,
};
