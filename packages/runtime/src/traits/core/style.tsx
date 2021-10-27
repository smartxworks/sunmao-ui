import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from 'src/types/RuntimeSchema';

const StyleTrait: TraitImplementation<Static<typeof PropsSchema>> = ({ slot, style }) => {
  return {
    props: {
      customStyle: {
        [slot]: style,
      },
    },
  };
};

const PropsSchema = Type.Object({
  slot: Type.String(),
  style: Type.String(),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'style',
      description: 'add style to component',
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [],
    },
  }),
  impl: StyleTrait,
};
