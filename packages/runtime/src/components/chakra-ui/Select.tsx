import { useState, useEffect } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Select as BaseSelect } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import { css } from '@emotion/react';

const StateSchema = Type.Object({
  value: Type.String(),
});

const Select: ComponentImplementation<Static<typeof PropsSchema>> = ({
  options,
  placeholder,
  defaultValue,
  errorBorderColor,
  focusBorderColor,
  isDisabled,
  isInvalid,
  isReadOnly,
  isRequired,
  size,
  variant,
  mergeState,
  customStyle
}) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    mergeState({ value: value });
  }, [value]);

  return (
    <BaseSelect
      background="white"
      placeholder={placeholder}
      value={value}
      errorBorderColor={errorBorderColor}
      focusBorderColor={focusBorderColor}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      size={size}
      variant={variant}
      onChange={e => setValue(e.target.value)}
      css={css`${customStyle?.content}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </BaseSelect>
  );
};

const PropsSchema = Type.Object({
  options: Type.Array(
    Type.Object({
      label: Type.String(),
      value: Type.String(),
    })
  ),
  placeholder: Type.Optional(Type.String()),
  defaultValue: Type.Optional(Type.String()),
  errorBorderColor: Type.Optional(Type.String()),
  focusBorderColor: Type.Optional(Type.String()),
  isDisabled: Type.Optional(Type.Boolean()),
  isInvalid: Type.Optional(Type.Boolean()),
  isReadOnly: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  size: Type.KeyOf(
    Type.Object({
      xs: Type.String(),
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
    })
  ),
  variant: Type.KeyOf(
    Type.Object({
      outline: Type.String(),
      unstyled: Type.String(),
      filled: Type.String(),
      flushed: Type.String(),
    })
  ),
});

const exampleProperties = {
  options: [
    {
      label: 'value1',
      value: 'value1',
    },
    {
      label: 'value2',
      value: 'value2',
    },
    {
      label: 'value3',
      value: 'value3',
    },
  ],
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'select',
      displayName: 'Select',
      description: 'chakra-ui select',
      isResizable: true,
      isDraggable: true,
      exampleProperties,
      exampleSize: [4, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: [],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: Select,
};
