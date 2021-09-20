import { CSSProperties } from 'react';
import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';

const useHiddenTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  hidden,
}) => {
  const style: CSSProperties = {};
  if (hidden) {
    style.display = 'none';
  }
  return {
    props: {
      style,
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
