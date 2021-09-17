import React, { useEffect } from 'react';
import { createComponent } from '@meta-ui/core';

const Dummy = () => {
  return null;
};

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'dummy',
      description: 'Dummy Invisible component',
    },
    spec: {
      properties: [],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Dummy,
};
