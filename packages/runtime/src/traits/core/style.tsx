import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from 'src/types/RuntimeSchema';

const StyleTrait: TraitImplementation<{
  style: Static<typeof PropsSchema>;
}> = ({ style }) => {
  return {
    props: {
      style: style,
    },
  };
};

const PropsSchema = Type.Object({
  string: Type.Object(Type.String()),
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
