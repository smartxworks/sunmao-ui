import React from 'react';
import { createComponent } from '@meta-ui/core';
import { Type } from '@sinclair/typebox';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';

const FormControlImpl: ComponentImplementation<{
  label: string;
  isRequired: boolean;
  isValid: boolean;
  errorMsg: string;
}> = ({ label, isRequired, slotsMap, isValid, errorMsg }) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={!isValid}>
      <FormLabel>{label}</FormLabel>
      <Slot slotsMap={slotsMap} slot="content" />
      <FormErrorMessage>{errorMsg}</FormErrorMessage>
    </FormControl>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'formControl',
      description: 'chakra-ui formControl',
    },
    spec: {
      properties: [
        {
          name: 'label',
          ...Type.String(),
        },
        {
          name: 'isRequired',
          ...Type.Boolean(),
        },
        {
          name: 'isValid',
          ...Type.Boolean(),
        },
        {
          name: 'errorMsg',
          ...Type.String(),
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: FormControlImpl,
};
