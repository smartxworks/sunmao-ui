import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Checkbox as BaseCheckbox } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';

const DefaultIsCheckedSchema = Type.Optional(Type.Boolean());
const IsDisabledSchema = Type.Optional(Type.Boolean());
const ColorSchemePropertySchema = Type.Optional(
  Type.KeyOf(
    Type.Object({
      whiteAlpha: Type.String(),
      blackAlpha: Type.String(),
      gray: Type.String(),
      red: Type.String(),
      orange: Type.String(),
      yellow: Type.String(),
      green: Type.String(),
      teal: Type.String(),
      blue: Type.String(),
      cyan: Type.String(),
      purple: Type.String(),
      pink: Type.String(),
      linkedin: Type.String(),
      facebook: Type.String(),
      messenger: Type.String(),
      whatsapp: Type.String(),
      twitter: Type.String(),
      telegram: Type.String(),
    })
  )
);
const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);
const IsInvalidSchema = Type.Optional(Type.Boolean());
const SpacingSchema = Type.Optional(Type.String());
const IsCheckedSchema = Type.Optional(Type.Boolean());
const IsIndeterminateSchema = Type.Optional(Type.Boolean());
const ValueSchema = Type.Optional(Type.Union([Type.String(), Type.Number()]));

const Checkbox: ComponentImplementation<{
  text: TextProps['value'];
  defaultIsChecked?: Static<typeof DefaultIsCheckedSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
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

  return (
    <BaseCheckbox
      {...{
        colorScheme,
        size,
      }}
      defaultChecked={defaultIsChecked}
      isDisabled={isDisabled}
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
