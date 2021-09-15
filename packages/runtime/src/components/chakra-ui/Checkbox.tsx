import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  Checkbox as BaseCheckbox,
  useCheckboxGroupContext,
} from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';
import _ from 'lodash';

const ValueSchema = Type.Union([Type.String(), Type.Number()]);
const DefaultIsCheckedSchema = Type.Optional(Type.Boolean());
export const IsDisabledSchema = Type.Optional(Type.Boolean());
const IsFocusableSchema = Type.Optional(Type.Boolean());
const IsInvalidSchema = Type.Optional(Type.Boolean());
const IsReadOnlySchema = Type.Optional(Type.Boolean());
const IsRequiredSchema = Type.Optional(Type.Boolean());
const SpacingSchema = Type.Optional(Type.String());
export const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);

const StateSchema = Type.Object({
  value: Type.String(),
});

const Checkbox: ComponentImplementation<{
  text: TextProps['value'];
  value: Static<typeof ValueSchema>;
  defaultIsChecked?: Static<typeof DefaultIsCheckedSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
  isFocusable?: Static<typeof IsFocusableSchema>;
  isInValid?: Static<typeof IsInvalidSchema>;
  isReadOnly?: Static<typeof IsReadOnlySchema>;
  isRequired?: Static<typeof IsRequiredSchema>;
  size?: Static<typeof SizePropertySchema>;
  spacing?: Static<typeof SpacingSchema>;
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
}> = ({
  text,
  value,
  defaultIsChecked,
  isDisabled,
  isFocusable,
  isInValid,
  isReadOnly,
  isRequired,
  size,
  spacing,
  colorScheme,
  mergeState,
}) => {
  const groupContext = useCheckboxGroupContext();
  let _defaultIsChecked = false;
  if (typeof defaultIsChecked === 'boolean') {
    _defaultIsChecked = defaultIsChecked;
  } else if (groupContext) {
    _defaultIsChecked = groupContext.value.some(val => val === value);
  }
  const [checked, setChecked] = useState(_defaultIsChecked);

  useEffect(() => {
    mergeState({ text: text.raw });
  }, [text.raw]);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  useEffect(() => {
    mergeState({ checked });
  }, [checked]);

  const args: {
    colorScheme?: Static<typeof ColorSchemePropertySchema>;
    size?: Static<typeof SizePropertySchema>;
  } = {};
  if (colorScheme) args.colorScheme = colorScheme;
  if (size) args.size = size;

  return (
    <BaseCheckbox
      value={value}
      defaultChecked={defaultIsChecked}
      isDisabled={isDisabled}
      isFocusable={isFocusable}
      isInvalid={isInValid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      size={size}
      spacing={spacing}
      colorScheme={colorScheme}
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
          name: 'value',
          ...ValueSchema,
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
  impl: Checkbox,
};
