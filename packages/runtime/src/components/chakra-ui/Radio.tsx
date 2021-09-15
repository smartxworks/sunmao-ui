import React, { useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Radio as BaseRadio } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const IsDisabledSchema = Type.Optional(Type.Boolean());
const IsFocusableSchema = Type.Optional(Type.Boolean());
const IsInvalidSchema = Type.Optional(Type.Boolean());
const IsReadOnlySchema = Type.Optional(Type.Boolean());
const IsRequiredSchema = Type.Optional(Type.Boolean());
const NameSchema = Type.Optional(Type.String());
const ValueSchema = Type.Union([Type.String(), Type.Number()]);
const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);
const SpacingSchema = Type.Optional(Type.String());

const StateSchema = Type.Object({
  value: Type.String(),
});

const Radio: ComponentImplementation<{
  text: TextProps['value'];
  value: Static<typeof ValueSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
  isFocusable?: Static<typeof IsFocusableSchema>;
  isInValid?: Static<typeof IsInvalidSchema>;
  isReadOnly?: Static<typeof IsReadOnlySchema>;
  isRequired?: Static<typeof IsRequiredSchema>;
  name?: Static<typeof NameSchema>;
  size?: Static<typeof SizePropertySchema>;
  spacing?: Static<typeof SpacingSchema>;
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
}> = ({
  text,
  value,
  isDisabled,
  isFocusable,
  isInValid,
  isReadOnly,
  isRequired,
  name,
  size,
  spacing,
  colorScheme,
  mergeState,
}) => {
  useEffect(() => {
    mergeState({ text: text.raw });
  }, [text.raw]);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseRadio
      value={value}
      isDisabled={isDisabled}
      isFocusable={isFocusable}
      isInvalid={isInValid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      name={name}
      size={size}
      spacing={spacing}
      colorScheme={colorScheme}>
      <Text value={text} />
    </BaseRadio>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'radio',
      description: 'chakra-ui radio',
    },
    spec: {
      properties: [
        {
          name: 'text',
          ...TextPropertySchema,
        },
        {
          name: 'value',
          ...ValueSchema,
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
          name: 'isInValid',
          ...IsInvalidSchema,
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
          name: 'name',
          ...NameSchema,
        },
        {
          name: 'size',
          ...SizePropertySchema,
        },
        {
          name: 'spacing',
          ...SpacingSchema,
        },
        {
          name: 'colorScheme',
          ...ColorSchemePropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Radio,
};
