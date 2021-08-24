import React from 'react';
import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';

type HiddenProps = {
  hidden: Static<typeof HiddenPropertySchema>;
};

const Hidden: React.FC<HiddenProps> = ({ hidden, children }) => {
  if (hidden) {
    return null;
  }
  return <>{children}</>;
};

const useHiddenTrait: TraitImplementation<HiddenProps> = ({ hidden }) => {
  return {
    props: null,
  };
};

const HiddenPropertySchema = Type.Union([Type.Boolean(), Type.String()]);

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'hidden',
      description: 'render component with condition',
    },
    spec: {
      properties: [
        {
          name: 'hidden',
          ...HiddenPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: useHiddenTrait,
};
