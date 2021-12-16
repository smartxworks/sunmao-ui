import React, { useEffect } from 'react';
import {
  Input as BaseInput,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';
import { css } from '@emotion/css';

const AppendElementPropertySchema = Type.Union([
  Type.Object({
    type: Type.KeyOf(Type.Object({ addon: Type.String() })),
    children: Type.Optional(Type.String()), // TODO: ReactNode
  }),
  Type.Object({
    type: Type.KeyOf(Type.Object({ element: Type.String() })),
    children: Type.Optional(Type.String()), // TODO: ReactNode
    fontSize: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
  }),
]);

const Input: ComponentImplementation<Static<typeof PropsSchema>> = ({
  variant,
  placeholder,
  size,
  focusBorderColor,
  isDisabled,
  isRequired,
  left,
  right,
  mergeState,
  subscribeMethods,
  defaultValue,
  customStyle
}) => {
  const [value, setValue] = React.useState(defaultValue || ''); // TODO: pin input
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    subscribeMethods({
      setInputValue({ value }) {
        setValue(value);
      },
      resetInputValue() {
        setValue(defaultValue || '');
      },
    });
  }, []);

  return (
    <InputGroup size={size} background="white">
      {left ? (
        left.type === 'addon' ? (
          <InputLeftAddon>{left.children}</InputLeftAddon>
        ) : (
          <InputLeftElement fontSize={left.fontSize} color={left.color}>
            {left.children}
          </InputLeftElement>
        )
      ) : (
        <></>
      )}
      <BaseInput
        value={value}
        variant={variant}
        placeholder={placeholder}
        focusBorderColor={focusBorderColor}
        isDisabled={isDisabled}
        isRequired={isRequired}
        onChange={onChange}
        className={css`${customStyle?.content}`}
      />
      {right ? (
        right.type === 'addon' ? (
          <InputRightAddon>{right.children}</InputRightAddon>
        ) : (
          <InputRightElement fontSize={right.fontSize} color={right.color}>
            {right.children}
          </InputRightElement>
        )
      ) : (
        <></>
      )}
    </InputGroup>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  variant: Type.KeyOf(
    Type.Object({
      outline: Type.String(),
      unstyled: Type.String(),
      filled: Type.String(),
      flushed: Type.String(),
    })
  ),
  placeholder: Type.Optional(Type.String()),
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
      xs: Type.String(),
    })
  ),
  focusBorderColor: Type.Optional(Type.String()),
  isDisabled: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  left: AppendElementPropertySchema,
  right: AppendElementPropertySchema,
  defaultValue: Type.Optional(Type.String()),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'input',
      displayName: 'Input',
      description: 'chakra_ui input',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        variant: 'outline',
        placeholder: 'Please input value',
        size: 'md',
        isDisabled: false,
        isRequired: false,
        defaultValue: '',
      },
      exampleSize: [4, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [
        {
          name: 'setInputValue',
          parameters: Type.Object({
            value: Type.String(),
          }),
        },
        {
          name: 'resetInputValue',
        },
      ],
      slots: [],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: Input,
};
