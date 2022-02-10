import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Select as BaseSelect } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  options: Type.Array(
    Type.Object({
      label: Type.String(),
      value: Type.String(),
    })
  ),
  placeholder: Type.Optional(Type.String()),
  defaultValue: Type.Optional(Type.String()),
  errorBorderColor: Type.Optional(Type.String()),
  focusBorderColor: Type.Optional(Type.String()),
  isDisabled: Type.Optional(Type.Boolean()),
  isInvalid: Type.Optional(Type.Boolean()),
  isReadOnly: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  size: Type.KeyOf(
    Type.Object({
      xs: Type.String(),
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
    })
  ),
  variant: Type.KeyOf(
    Type.Object({
      outline: Type.String(),
      unstyled: Type.String(),
      filled: Type.String(),
      flushed: Type.String(),
    })
  ),
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
};

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'select',
    displayName: 'Select',
    description: 'chakra-ui select',
    isResizable: true,
    isDraggable: true,
    exampleProperties,
    exampleSize: [4, 1],
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
    $ref,
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
        ref={$ref}
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
