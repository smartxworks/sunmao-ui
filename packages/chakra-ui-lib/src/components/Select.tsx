import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Select as BaseSelect } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, APPEARANCE } from './constants/category';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  options: Type.Array(
    Type.Object({
      label: Type.String({
        title: 'Label',
      }),
      value: Type.String({
        title: 'Value',
      }),
    }),
    {
      title: 'Options',
      category: BASIC,
    }
  ),
  placeholder: Type.String({
    title: 'Placeholder',
    category: BASIC,
  }),
  defaultValue: Type.String({
    title: 'Default Value',
    category: BASIC,
  }),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BEHAVIOR,
  }),
  isInvalid: Type.Boolean({
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
  size: Type.KeyOf(
    Type.Object({
      xs: Type.String(),
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
    }),
    {
      title: 'Size',
      category: APPEARANCE,
    }
  ),
  variant: Type.KeyOf(
    Type.Object({
      outline: Type.String(),
      unstyled: Type.String(),
      filled: Type.String(),
      flushed: Type.String(),
    }),
    {
      title: 'Variant',
      category: APPEARANCE,
    }
  ),
  errorBorderColor: Type.String({
    title: 'Border Color Of Error',
    category: APPEARANCE,
  }),
  focusBorderColor: Type.String({
    title: 'Border Color Of Focus',
    category: APPEARANCE,
  }),
});

const exampleProperties = {
  options: [
    {
      label: 'value1',
      value: 'value1',
    },
    {
      label: 'value2',
      value: 'value2',
    },
    {
      label: 'value3',
      value: 'value3',
    },
  ],
  placeholder: 'Select an option',
  defaultValue: '',
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isRequired: false,
  size: 'md',
  variant: 'outline',
  errorBorderColor: 'red',
  focusBorderColor: 'blue',
};

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'select',
    displayName: 'Select',
    description: 'chakra-ui select',
    exampleProperties,
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
    options,
    placeholder,
    defaultValue,
    errorBorderColor,
    focusBorderColor,
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    size,
    variant,
    mergeState,
    customStyle,
    elementRef,
  }) => {
    const [value, setValue] = useState<string | undefined>(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
      mergeState({ value: value });
    }, [mergeState, value]);

    return (
      <BaseSelect
        background="white"
        placeholder={placeholder}
        value={value}
        errorBorderColor={errorBorderColor}
        focusBorderColor={focusBorderColor}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        size={size}
        variant={variant}
        onChange={e => setValue(e.target.value)}
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </BaseSelect>
    );
  }
);
