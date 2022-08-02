import { useState, useEffect, useRef } from 'react';
import { Static, Type } from '@sinclair/typebox';
import { Checkbox as BaseCheckbox, useCheckboxGroupContext } from '@chakra-ui/react';
import { implementRuntimeComponent, Text, TextPropertySpec } from '@sunmao-ui/runtime';
import { getColorSchemePropertySpec } from './Types/ColorScheme';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, LAYOUT, APPEARANCE } from './constants/category';

export const IsDisabledSpec = Type.Boolean({
  title: 'Disabled',
  category: BEHAVIOR,
});
export const SizePropertySpec = Type.KeyOf(
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

export const CheckboxStateSpec = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
  text: Type.String(),
  checked: Type.Boolean(),
});

const PropsSpec = Type.Object({
  text: TextPropertySpec,
  value: Type.Union([Type.String(), Type.Number()], {
    title: 'Value',
    description: 'The value of the checkbox which is used by check group.',
    category: BASIC,
  }),
  defaultIsChecked: Type.Boolean({
    title: 'Default Checked',
    category: BASIC,
  }),
  isDisabled: IsDisabledSpec,
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
  size: SizePropertySpec,
  colorScheme: getColorSchemePropertySpec({
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
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: CheckboxStateSpec,
    methods: {},
    slots: {},
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
    getElement,
  }) => {
    const groupContext = useCheckboxGroupContext();
    let _defaultIsChecked = false;
    if (typeof defaultIsChecked === 'boolean') {
      _defaultIsChecked = defaultIsChecked;
    } else if (groupContext) {
      _defaultIsChecked = groupContext.value.some(val => val === value);
    }
    const [checked, setChecked] = useState(_defaultIsChecked);

    const ref = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
      if (getElement && ref.current) {
        getElement(ref.current.parentElement as HTMLElement);
      }
    }, [getElement, ref]);

    const args: {
      colorScheme?: Static<ReturnType<typeof getColorSchemePropertySpec>>;
      size?: Static<typeof SizePropertySpec>;
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
        ref={ref}
      >
        <Text value={text} />
      </BaseCheckbox>
    );
  }
);
