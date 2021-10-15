import { createComponent } from '@meta-ui/core';
import { useEffect } from 'react';
import { ComponentImplementation } from '../../services/registry';

const Dummy: ComponentImplementation<Record<string, unknown>> = ({ effects }) => {
  useEffect(() => {
    return () => {
      effects?.forEach(e => e());
    };
  }, []);

  return null;
};
export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'dummy',
      displayName: 'Dummy',
      description: 'Dummy Invisible component',
      isDraggable: false,
      isResizable: false,
      exampleProperties: {},
      exampleSize: [1, 1],
    },
    spec: {
      properties: {},
      state: {},
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: Dummy,
};
