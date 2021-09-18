import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { watch } from '@vue-reactivity/watch';
import { stateStore } from '../../store';
import { CheckboxStateSchema } from './Checkbox';

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  helperText: string;
}> = ({ label, fieldName, isRequired, helperText, slotsMap, mergeState }) => {
  const [inputValue, setInputValue] = useState('');
  // don't show Invalid state on component mount
  const [hideInvalid, setHideInvalid] = useState(true);
  const [validResult, setValidResult] = useState({
    isInvalid: false,
    errorMsg: '',
  });
  const { isInvalid, errorMsg } = validResult;

  useEffect(() => {
    const inputId = _.first(slotsMap?.get('content'))?.id || '';
    const stop = watch(
      () => {
        if (stateStore[inputId].checked !== undefined) {
          // special treatment for checkbox
          return (stateStore[inputId] as Static<typeof CheckboxStateSchema>)
            .checked;
        } else {
          return stateStore[inputId].value;
        }
      },
      newV => {
        setInputValue(newV);
      }
    );
    setInputValue(stateStore[inputId].value);
    return stop;
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
    if (inputValue) {
      // After inputValue first change, begin to show Invalid state
      setHideInvalid(false);
    }
    mergeState({
      inputId: _.first(slotsMap?.get('content'))?.id || '',
      fieldName,
      isInvalid: !!(isInvalid || (!inputValue && isRequired)),
      value: inputValue,
    });
  }, [slotsMap, fieldName, isInvalid, isRequired, inputValue]);

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!hideInvalid && (isInvalid || (!inputValue && isRequired))}>
      <FormLabel>{label}</FormLabel>
      <Slot slotsMap={slotsMap} slot="content" />
      <FormErrorMessage>{errorMsg}</FormErrorMessage>
      <FormHelperText>{helperText}</FormHelperText>
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
          name: 'helperText',
          ...Type.String(),
        },
      ],
      acceptTraits: [],
      state: Type.Object({
        inputId: Type.String(),
        fieldName: Type.String(),
        isInvalid: Type.Boolean(),
        value: Type.Any(),
      }),
      methods: [],
    },
  }),
  impl: FormControlImpl,
};
