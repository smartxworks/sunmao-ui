import { createComponent } from '@meta-ui/core';
import { useEffect } from 'react';
import { ComponentImplementation } from 'src/registry';

const Dummy: ComponentImplementation<Record<string, unknown>> = ({
  effects,
}) => {
  useEffect(() => {
    effects?.forEach(e => e());
  }, []);

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
      properties: {},
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Dummy,
};
