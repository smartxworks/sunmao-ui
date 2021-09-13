import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Select as BaseSelect } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';

const OptionsSchema = Type.Array(
  Type.Object({
    label: Type.String(),
    value: Type.String(),
  })
);
const PlaceholderSchema = Type.Optional(Type.String());
const DefaultValueSchema = Type.Optional(Type.String());
const ErrorBorderColorSchema = Type.Optional(Type.String());
const FocusBorderColorSchema = Type.Optional(Type.String());
const IsDisabledSchema = Type.Optional(Type.Boolean());
const IsInvalidSchema = Type.Optional(Type.Boolean());
const IsReadOnlySchema = Type.Optional(Type.Boolean());
const IsRequiredSchema = Type.Optional(Type.Boolean());
const SizeSchema = Type.KeyOf(
  Type.Object({
    xs: Type.String(),
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);
const VariantSchema = Type.KeyOf(
  Type.Object({
    outline: Type.String(),
    unstyled: Type.String(),
    filled: Type.String(),
    flushed: Type.String(),
  })
);

const Select: ComponentImplementation<{
  options: Static<typeof OptionsSchema>;
  placeholder?: Static<typeof PlaceholderSchema>;
  defaultValue?: Static<typeof DefaultValueSchema>;
  errorBorderColor?: Static<typeof ErrorBorderColorSchema>;
  focusBorderColor?: Static<typeof FocusBorderColorSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
  isInvalid?: Static<typeof IsInvalidSchema>;
  isReadOnly?: Static<typeof IsReadOnlySchema>;
  isRequired?: Static<typeof IsRequiredSchema>;
  size?: Static<typeof SizeSchema>;
  variant?: Static<typeof VariantSchema>;
}> = ({
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
}) => {
  const [state, setState] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    mergeState({ value: state });
  }, [state]);

  return (
    <BaseSelect
      placeholder={placeholder}
      defaultValue={state}
      errorBorderColor={errorBorderColor}
      focusBorderColor={focusBorderColor}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      size={size}
      variant={variant}
      onChange={e => setState(e.target.value)}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </BaseSelect>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'select',
      description: 'chakra-ui select',
    },
    spec: {
      properties: [
        {
          name: 'options',
          ...OptionsSchema,
        },
        {
          name: 'placeholder',
          ...PlaceholderSchema,
        },
        {
          name: 'defaultValue',
          ...DefaultValueSchema,
        },
        {
          name: 'errorBorderColor',
          ...ErrorBorderColorSchema,
        },
        {
          name: 'focusBorderColor',
          ...FocusBorderColorSchema,
        },
        {
          name: 'isDisabled',
          ...IsDisabledSchema,
        },
        {
          name: 'isInvalid',
          ...IsInvalidSchema,
        },
        {
          name: 'isReadOnly',
          ...IsReadOnlySchema,
        },
        {
          name: 'isRequired',
          ...IsRequiredSchema,
        },
        {
          name: 'size',
          ...SizeSchema,
        },
        {
          name: 'variant',
          ...VariantSchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Select,
};
