import { useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Radio as BaseRadio } from '@chakra-ui/react';
import { implementRuntimeComponent, Text, TextPropertySchema } from '@sunmao-ui/runtime';
import { getColorSchemePropertySchema } from './Types/ColorScheme';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, APPEARANCE, LAYOUT } from './constants/category';

const StateSchema = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  value: Type.Union([Type.String(), Type.Number()], {
    title: 'Value',
    category: BASIC,
  }),
  name: Type.String({
    title: 'Name',
    category: BASIC,
  }),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BEHAVIOR,
  }),
  isFocusable: Type.Boolean({
    title: 'Focusable',
    category: BEHAVIOR,
  }),
  isInValid: Type.Boolean({
    title: 'Invalid',
    category: BEHAVIOR,
  }),
  isReadOnly: Type.Boolean({
    title: 'Read Only',
    category: BEHAVIOR,
  }),
  isRequired: Type.Boolean({
    title: 'Required',
    category: BEHAVIOR,
  }),
  spacing: Type.String({
    title: 'Spacing',
    category: LAYOUT,
  }),
  colorScheme: getColorSchemePropertySchema({
    title: 'Color Scheme',
    category: APPEARANCE,
  }),
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
    }),
    {
      title: 'Size',
      category: APPEARANCE,
    }
  ),
});

export default implementRuntimeComponent({
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
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
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
    customStyle,
    elementRef,
  }) => {
    useEffect(() => {
      mergeState({ value: text.raw });
    }, [mergeState, text.raw]);

    useEffect(() => {
      mergeState({ value });
    }, [mergeState, value]);

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
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
      >
        <Text value={text} />
      </BaseRadio>
    );
  }
);
