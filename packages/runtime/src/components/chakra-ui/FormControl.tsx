import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { ValidResultSchema } from '../../types/ValidResultSchema';
import { watch } from '@vue-reactivity/watch';
import { stateStore } from '../../store';

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  // validResult?: Static<typeof ValidResultSchema>;
}> = ({ label, fieldName, isRequired, slotsMap, mergeState }) => {
  const [inputValue, setInputValue] = useState('');
  const [validResult, setValidResult] = useState({
    isInvalid: false,
    errorMsg: '',
  });
  const { isInvalid, errorMsg } = validResult;

  useEffect(() => {
    const inputId = _.first(slotsMap?.get('content'))?.id || '';
    return watch(
      () => {
        return stateStore[inputId].value;
      },
      newV => {
        setInputValue(newV);
      }
    );
  }, [slotsMap, setInputValue]);

  useEffect(() => {
    const inputId = _.first(slotsMap?.get('content'))?.id || '';
    return watch(
      () => {
        return stateStore[inputId].validResult;
      },
      newV => {
        setValidResult(newV);
      }
    );
  }, [slotsMap, setValidResult]);

  useEffect(() => {
    console.log('merge', !!(isInvalid || (!inputValue && isRequired)));
    mergeState({
      inputId: _.first(slotsMap?.get('content'))?.id || '',
      fieldName,
      isInvalid: !!(isInvalid || (!inputValue && isRequired)),
    });
  }, [slotsMap, fieldName, isInvalid, isRequired, inputValue]);

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={isInvalid || (!inputValue && isRequired)}>
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
      ],
      acceptTraits: [],
      state: Type.Object({
        inputId: Type.String(),
        fieldName: Type.String(),
        isInvalid: Type.Boolean(),
      }),
      methods: [],
    },
  }),
  impl: FormControlImpl,
};
