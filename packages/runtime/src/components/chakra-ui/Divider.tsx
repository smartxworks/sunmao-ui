import { Divider } from '@chakra-ui/react';
import { createComponent } from '@sunmao-ui/core';
import { ComponentImplementation } from '../../services/registry';

const DividerImpl: ComponentImplementation = () => {
  return <Divider />;
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'divider',
      displayName: 'Divider',
      description: 'chakra-ui divider',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {},
      exampleSize: [4, 1],
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
  impl: DividerImpl,
};
