import { useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Radio as BaseRadio } from '@chakra-ui/react';
import { implementRuntimeComponent, Text, TextPropertySpec } from '@sunmao-ui/runtime';
import { getColorSchemePropertySpec } from './Types/ColorScheme';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, APPEARANCE, LAYOUT } from './constants/category';

const StateSpec = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
});

const PropsSpec = Type.Object({
  text: TextPropertySpec,
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
  colorScheme: getColorSchemePropertySpec({
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
    exampleProperties: {
      text: {
        raw: 'Radio',
        format: 'plain',
      },
      value: 'Radio 1',
      isDisabled: false,
      size: 'md',
    },
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {},
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
