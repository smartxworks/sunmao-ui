import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent2, Slot } from '@sunmao-ui/runtime';

export default implementRuntimeComponent2({
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
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: ['root'],
    styleSlots: [],
    events: [],
  },
})(({ slotsMap }) => {
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
});
