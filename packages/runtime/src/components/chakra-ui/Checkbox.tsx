import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Checkbox as BaseCheckbox } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const DefaultIsCheckedSchema = Type.Optional(Type.Boolean());
export const IsDisabledSchema = Type.Optional(Type.Boolean());
export const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);
const IsFocusableSchema = Type.Optional(Type.Boolean());
const IsInvalidSchema = Type.Optional(Type.Boolean());
const IsReadOnlySchema = Type.Optional(Type.Boolean());
const IsRequiredSchema = Type.Optional(Type.Boolean());
const SpacingSchema = Type.Optional(Type.String());
const IsCheckedSchema = Type.Optional(Type.Boolean());
const IsIndeterminateSchema = Type.Optional(Type.Boolean());
const ValueSchema = Type.Optional(Type.Union([Type.String(), Type.Number()]));

const Checkbox: ComponentImplementation<{
  text: TextProps['value'];
  defaultIsChecked?: Static<typeof DefaultIsCheckedSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
  isFocusable?: Static<typeof IsFocusableSchema>;
  isReadOnly?: Static<typeof IsReadOnlySchema>;
  isRequired?: Static<typeof IsRequiredSchema>;
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
  size?: Static<typeof SizePropertySchema>;
  isInValid?: Static<typeof IsInvalidSchema>;
  spacing?: Static<typeof SpacingSchema>;
  isChecked?: Static<typeof IsCheckedSchema>;
  isIndeterminate?: Static<typeof IsIndeterminateSchema>;
  value?: Static<typeof ValueSchema>;
}> = ({
  text,
  defaultIsChecked,
  isDisabled,
  isFocusable,
  isReadOnly,
  isRequired,
  colorScheme,
  size,
  isInValid,
  spacing,
  isChecked,
  isIndeterminate,
  value,
  mergeState,
}) => {
  const [checked, setChecked] = useState(defaultIsChecked);

  useEffect(() => {
    mergeState({ value: text.raw });
  }, [text.raw]);

  useEffect(() => {
    mergeState({ value: checked });
  }, [checked]);

  const args: {
    colorScheme?: Static<typeof ColorSchemePropertySchema>;
    size?: Static<typeof SizePropertySchema>;
  } = {};
  if (colorScheme) args.colorScheme = colorScheme;
  if (size) args.size = size;

  return (
    <BaseCheckbox
      {...args}
      defaultChecked={defaultIsChecked}
      isDisabled={isDisabled}
      isFocusable={isFocusable}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInValid}
      spacing={spacing}
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      value={value}
      onChange={e => {
        setChecked(e.target.checked);
      }}>
      <Text value={text} />
    </BaseCheckbox>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'checkbox',
      description: 'chakra-ui checkbox',
    },
    spec: {
      properties: [
        {
          name: 'text',
          ...TextPropertySchema,
        },
        {
          name: 'defaultIsChecked',
          ...DefaultIsCheckedSchema,
        },
        {
          name: 'isDisabled',
          ...IsDisabledSchema,
        },
        {
          name: 'isFocusable',
          ...IsFocusableSchema,
        },
        {
          name: 'isReadOnly',
          ...IsReadOnlySchema,
        },
        {
          name: 'isRequired',
          ...IsReadOnlySchema,
        },
        {
          name: 'colorScheme',
          ...ColorSchemePropertySchema,
        },
        {
          name: 'size',
          ...SizePropertySchema,
        },
        {
          name: 'isInValid',
          ...IsInvalidSchema,
        },
        {
          name: 'spacing',
          ...SpacingSchema,
        },
        {
          name: 'isChecked',
          ...IsCheckedSchema,
        },
        {
          name: 'isIndeterminate',
          ...IsIndeterminateSchema,
        },
        {
          name: 'value',
          ...ValueSchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Checkbox,
};
