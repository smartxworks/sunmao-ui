import { useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Radio as BaseRadio } from '@chakra-ui/react';
import { ComponentImplementation } from '../../modules/registry';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const StateSchema = Type.Object({
  value: Type.String(),
});

const Radio: ComponentImplementation<Static<typeof PropsSchema>> = ({
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
      colorScheme={colorScheme}
    >
      <Text value={text} />
    </BaseRadio>
  );
};

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  value: Type.Union([Type.String(), Type.Number()]),
  isDisabled: Type.Optional(Type.Boolean()),
  isFocusable: Type.Optional(Type.Boolean()),
  isInValid: Type.Optional(Type.Boolean()),
  isReadOnly: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  name: Type.Optional(Type.String()),
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
    })
  ),
  spacing: Type.Optional(Type.String()),
  colorScheme: ColorSchemePropertySchema,
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'radio',
      description: 'chakra-ui radio',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Radio,
};
