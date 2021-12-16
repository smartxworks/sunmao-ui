import { useState, useEffect } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Checkbox as BaseCheckbox, useCheckboxGroupContext } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ColorSchemePropertySchema } from './Types/ColorScheme';
import { css } from '@emotion/css';

export const IsDisabledSchema = Type.Optional(Type.Boolean());
export const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);

export const CheckboxStateSchema = Type.Object({
  value: Type.String(),
  Text: Type.String(),
  checked: Type.Boolean(),
});

const Checkbox: ComponentImplementation<Static<typeof PropsSchema>> = ({
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
  customStyle,
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

  useEffect(() => {
    setChecked(!!defaultIsChecked);
  }, [setChecked, defaultIsChecked]);

  const args: {
    colorScheme?: Static<typeof ColorSchemePropertySchema>;
    size?: Static<typeof SizePropertySchema>;
  } = {};

  if (colorScheme) args.colorScheme = colorScheme;
  if (size) args.size = size;

  return (
    <BaseCheckbox
      height="10"
      value={value}
      isChecked={checked}
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
      }}
      className={css`${customStyle?.content}`}
    >
      <Text value={text} />
    </BaseCheckbox>
  );
};

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  value: Type.Union([Type.String(), Type.Number()]),
  defaultIsChecked: Type.Optional(Type.Boolean()),
  isDisabled: IsDisabledSchema,
  isFocusable: Type.Optional(Type.Boolean()),
  isInValid: Type.Optional(Type.Boolean()),
  isReadOnly: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  size: SizePropertySchema,
  spacing: Type.Optional(Type.String()),
  colorScheme: ColorSchemePropertySchema,
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'checkbox',
      description: 'chakra-ui checkbox',
      displayName: 'Checkbox',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        text: {
          raw: 'Checkbox',
          format: 'plain',
        },
        value: 'checkbox 1',
        defaultIsChecked: true,
        isDisabled: false,
        size: 'md',
      },
      exampleSize: [3, 1],
    },
    spec: {
      properties: PropsSchema,
      state: CheckboxStateSchema,
      methods: [],
      slots: [],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: Checkbox,
};
