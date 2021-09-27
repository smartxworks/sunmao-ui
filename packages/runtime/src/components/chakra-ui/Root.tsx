import { ChakraProvider } from '@chakra-ui/react';
import { ComponentImplementation } from '../../modules/registry';
import { createComponent } from '@meta-ui/core';
import Slot from '../_internal/Slot';

const Root: ComponentImplementation<Record<string, unknown>> = ({ slotsMap }) => {
  return (
    <ChakraProvider>
      <Slot slotsMap={slotsMap} slot="root" />
    </ChakraProvider>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'root',
      description: 'chakra-ui provider',
    },
    spec: {
      properties: {},
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Root,
};
