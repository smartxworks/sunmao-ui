import React, { useEffect } from 'react';
import _ from 'lodash';
import { createComponent } from '@meta-ui/core';
import { Type } from '@sinclair/typebox';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  isValid: boolean;
  errorMsg: string;
}> = ({
  label,
  fieldName,
  isRequired,
  slotsMap,
  isValid,
  errorMsg,
  mergeState,
}) => {
  useEffect(() => {
    mergeState({
      inputId: _.first(slotsMap?.get('content'))?.id || '',
      fieldName,
    });
  }, [slotsMap, fieldName]);

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
          name: 'fieldName',
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
      state: Type.Object({
        inputId: Type.String(),
        fieldName: Type.String(),
      }),
      methods: [],
    },
  }),
  impl: FormControlImpl,
};
