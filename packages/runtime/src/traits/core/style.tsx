import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';

const StyleTrait: TraitImplementation<{
  style: Static<typeof StylesPropertySchema>;
}> = ({ style }) => {
  return {
    props: {
      style: style,
    },
  };
};

const StylesPropertySchema = Type.Array(Type.Object(Type.String()));
export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'style',
      description: 'add style to component',
    },
    spec: {
      properties: [
        {
          name: 'style',
          ...StylesPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: StyleTrait,
};
