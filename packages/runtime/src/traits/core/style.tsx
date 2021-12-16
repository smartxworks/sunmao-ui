import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../types/RuntimeSchema';

const StyleTrait: TraitImplementation<Static<typeof PropsSchema>> = ({ styles }) => {
  const customStyle: Record<string, string> = {};
  styles.forEach(style => {
    customStyle[style.styleSlot] = style.style;
  });
  return {
    props: {
      customStyle,
    },
  };
};

const PropsSchema = Type.Object({
  styles: Type.Array(
    Type.Object({
      styleSlot: Type.String(),
      style: Type.String(),
    })
  ),
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
