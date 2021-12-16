import { useEffect } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Radio as BaseRadio } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';
import { css } from '@emotion/css';

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
  customStyle
}) => {
  useEffect(() => {
    mergeState({ text: text.raw });
  }, [text.raw]);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseRadio
      height="10"
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
      className={css`${customStyle?.content}`}
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
      displayName: 'Radio',
      description: 'chakra-ui radio',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        text: {
          raw: 'Radio',
          format: 'plain',
        },
        value: 'Radio 1',
        isDisabled: false,
        size: 'md',
      },
      exampleSize: [3, 1],
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
  impl: Radio,
};
