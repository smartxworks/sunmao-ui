import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { watch } from '@vue-reactivity/watch';
import {
  FormControlContentCSS,
  FormControlCSS,
  FormItemCSS,
  FormLabelCSS,
} from './FormCSS';
import { ComponentImplementation } from '../../../services/registry';
import Slot from '../../_internal/Slot';
import { CheckboxStateSchema } from '../Checkbox';

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  helperText: string;
}> = ({ label, fieldName, isRequired, helperText, slotsMap, mergeState, services }) => {
  const [inputValue, setInputValue] = useState('');
  // don't show Invalid state on component mount
  const [hideInvalid, setHideInvalid] = useState(true);
  const inputId = useMemo(() => _.first(slotsMap?.get('content'))?.id || '', []);
  const [validResult, setValidResult] = useState({
    isInvalid: false,
    errorMsg: '',
  });
  const { isInvalid, errorMsg } = validResult;

  useEffect(() => {
    if (!inputId) return;
    const stop = watch(
      () => {
        const inputState = services.stateManager.store[inputId];
        if (!inputState) return '';
        if (inputState.checked !== undefined) {
          // special treatment for checkbox
          return (inputState as Static<typeof CheckboxStateSchema>).checked;
        } else {
          return inputState.value;
        }
      },
      newV => {
        setInputValue(newV);
      }
    );
    setInputValue(services.stateManager.store[inputId].value);
    return stop;
  }, [inputId, setInputValue]);

  useEffect(() => {
    if (!inputId) return;
    const stop = watch(
      () => {
        return services.stateManager.store[inputId]?.validResult;
      },
      newV => {
        setValidResult(newV);
      }
    );
    if (services.stateManager.store[inputId]?.validResult) {
      setValidResult(services.stateManager.store[inputId].validResult);
    }
    return stop;
  }, [inputId, setValidResult]);

  useEffect(() => {
    if (!inputId) return;
    if (inputValue) {
      // After inputValue first change, begin to show Invalid state
      setHideInvalid(false);
    }
    mergeState({
      inputId: inputId,
      fieldName,
      isInvalid: !!(isInvalid || (!inputValue && isRequired)),
      value: inputValue,
    });
  }, [inputId, inputId, fieldName, isInvalid, isRequired, inputValue]);

  const placeholder = <Text color="gray.200">Please Add Input Here</Text>;
  const slotView = <Slot css={FormItemCSS} slotsMap={slotsMap} slot="content" />;

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!hideInvalid && (isInvalid || (!inputValue && isRequired))}
      css={FormControlCSS}
    >
      <div css={FormControlContentCSS}>
        <FormLabel css={FormLabelCSS}>{label}</FormLabel>
        {inputId ? slotView : placeholder}
      </div>
      {errorMsg ? (
        <FormErrorMessage css={FormItemCSS}>{errorMsg}</FormErrorMessage>
      ) : undefined}
      {helperText ? (
        <FormHelperText css={FormItemCSS}>{helperText}</FormHelperText>
      ) : undefined}
    </FormControl>
  );
};

const PropsSchema = Type.Object({
  label: Type.String(),
  fieldName: Type.String(),
  isRequired: Type.Boolean(),
  helperText: Type.String(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'formControl',
      isResizable: false,
      isDraggable: true,
      displayName: 'Form Control',
      description: 'chakra-ui formControl',
      exampleProperties: {
        label: 'name',
        fieldName: 'name',
        isRequired: false,
        helperText: '',
      },
      exampleSize: [4, 2],
    },
    spec: {
      properties: PropsSchema,
      state: Type.Object({
        inputId: Type.String(),
        fieldName: Type.String(),
        isInvalid: Type.Boolean(),
        value: Type.Any(),
      }),
      methods: [],
      slots: ['content'],
      styleSlots: [],
      events: [],
    },
  }),
  impl: FormControlImpl,
};
