import { useEffect, useMemo, useState } from 'react';
import { first } from 'lodash-es';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
} from '@chakra-ui/react';
import { css } from '@emotion/css';
import { ComponentImplementation, Slot, watch } from '@sunmao-ui/runtime';
import { CheckboxStateSchema } from '../Checkbox';

const FormItemCSS = {
  flex: '0 0 auto',
  width: '66%',
};

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  helperText: string;
}> = ({
  label,
  fieldName,
  isRequired,
  helperText,
  slotsMap,
  mergeState,
  services,
  customStyle,
}) => {
  const [inputValue, setInputValue] = useState('');
  // don't show Invalid state on component mount
  const [hideInvalid, setHideInvalid] = useState(true);
  const inputId = useMemo(() => first(slotsMap?.get('content'))?.id || '', []);
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
  const slotView = <Slot {...FormItemCSS} slotsMap={slotsMap} slot="content" />;

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!hideInvalid && (isInvalid || (!inputValue && isRequired))}
      display="flex"
      flexDirection="column"
      alignItems="end"
      className={css`
        ${customStyle?.content}
      `}
    >
      <HStack width="full">
        <FormLabel flex="0 0 auto" width="33%" margin="auto 0">
          {label}
        </FormLabel>
        {inputId ? slotView : placeholder}
      </HStack>
      {errorMsg ? (
        <FormErrorMessage {...FormItemCSS}>{errorMsg}</FormErrorMessage>
      ) : undefined}
      {helperText ? (
        <FormHelperText {...FormItemCSS}>{helperText}</FormHelperText>
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
      methods: {},
      slots: ['content'],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: FormControlImpl,
};
