import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'root',
    displayName: 'Root',
    description: 'chakra-ui provider',
    isDraggable: false,
    isResizable: true,
    exampleProperties: {},
    exampleSize: [6, 6],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: ['root'],
    styleSlots: [],
    events: [],
  },
})(({ slotsElements, $ref }) => {
  return (
    <ChakraProvider
      theme={extendTheme({
        initialColorMode: 'dark',
        useSystemColorMode: false,
      })}
    >
      <div ref={$ref}>{slotsElements.root}</div>
    </ChakraProvider>
  );
});
