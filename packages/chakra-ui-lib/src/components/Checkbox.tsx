import { useState, useEffect } from 'react';
import { Static, Type } from '@sinclair/typebox';
import { Checkbox as BaseCheckbox, useCheckboxGroupContext } from '@chakra-ui/react';
import { implementRuntimeComponent, Text, TextPropertySchema } from '@sunmao-ui/runtime';
import { getColorSchemePropertySchema } from './Types/ColorScheme';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, LAYOUT, APPEARANCE } from './constants/category';

export const IsDisabledSchema = Type.Boolean({
  title: 'Disabled',
  category: BEHAVIOR,
});
export const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  }),
  {
    title: 'Size',
    category: APPEARANCE,
  }
);

export const CheckboxStateSchema = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
  text: Type.String(),
  checked: Type.Boolean(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  value: Type.Union([Type.String(), Type.Number()], {
    title: 'Value',
    description: 'The value of the checkbox which is used by check group.',
    category: BASIC,
  }),
  defaultIsChecked: Type.Boolean({
    title: 'Default Checked',
    category: BASIC,
  }),
  isDisabled: IsDisabledSchema,
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
  size: SizePropertySchema,
  colorScheme: getColorSchemePropertySchema({
    title: 'Color Scheme',
    category: APPEARANCE,
  }),
});

export default implementRuntimeComponent({
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
      isFocusable: true,
      isInValid: false,
      isReadOnly: false,
      isRequired: false,
      size: 'md',
      spacing: '',
      colorScheme: 'blue',
    },
    exampleSize: [3, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: CheckboxStateSchema,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
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
    elementRef,
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
    }, [mergeState, text.raw]);

    useEffect(() => {
      mergeState({ value });
    }, [mergeState, value]);

    useEffect(() => {
      mergeState({ checked });
    }, [checked, mergeState]);

    useEffect(() => {
      setChecked(!!defaultIsChecked);
    }, [setChecked, defaultIsChecked]);

    const args: {
      colorScheme?: Static<ReturnType<typeof getColorSchemePropertySchema>>;
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
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
      >
        <Text value={text} />
      </BaseCheckbox>
    );
  }
);
