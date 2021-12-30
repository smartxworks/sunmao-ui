import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ComponentImplementation, Slot } from '@sunmao-ui/runtime';
import { createComponent } from '@sunmao-ui/core';

const Root: ComponentImplementation<Record<string, unknown>> = ({ slotsMap }) => {
  return (
    <ChakraProvider
      theme={extendTheme({
        initialColorMode: 'dark',
        useSystemColorMode: false,
      })}
    >
      <Slot slotsMap={slotsMap} slot="root" />
    </ChakraProvider>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'root',
      displayName: 'Root',
      description: 'chakra-ui provider',
      isDraggable: false,
      isResizable: true,
      exampleProperties: {},
      exampleSize: [6, 6],
    },
    spec: {
      properties: {},
      state: {},
      methods: {},
      slots: ['root'],
      styleSlots: [],
      events: [],
    },
  }),
  impl: Root,
};
