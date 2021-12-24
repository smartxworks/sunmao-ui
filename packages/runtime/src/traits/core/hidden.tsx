import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../types/RuntimeSchema';

const useHiddenTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  hidden,
  visually,
}) => {
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

const PropsSchema = Type.Object({
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
      properties: PropsSchema,
    },
  }),
  impl: useHiddenTrait,
};
