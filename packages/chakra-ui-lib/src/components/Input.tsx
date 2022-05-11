import React, { useEffect } from 'react';
import {
  Input as BaseInput,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { BASIC, APPEARANCE, BEHAVIOR } from './constants/category';

const getAppendElementPropertySpec = (options?: Record<string, any>) =>
  Type.Optional(
    Type.Union(
      [
        Type.Object({
          type: Type.KeyOf(Type.Object({ addon: Type.String() }), {
            title: 'Type',
          }),
          children: Type.String({
            title: 'Content',
          }), // TODO: ReactNode
        }),
        Type.Object({
          type: Type.KeyOf(Type.Object({ element: Type.String() }), {
            title: 'Type',
          }),
          children: Type.String({
            title: 'Content',
          }), // TODO: ReactNode
          fontSize: Type.String({
            title: 'Font Size',
          }),
          color: Type.String({
            title: 'Color',
          }),
        }),
      ],
      options
    )
  );

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  defaultValue: Type.String({
    title: 'Default Value',
    category: BASIC,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: BASIC,
  }),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BEHAVIOR,
  }),
  isRequired: Type.Boolean({
    title: 'Required',
    category: BEHAVIOR,
  }),
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
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
      xs: Type.String(),
    }),
    {
      title: 'Size',
      category: APPEARANCE,
    }
  ),
  left: getAppendElementPropertySpec({
    title: 'Left Append',
    category: APPEARANCE,
  }),
  right: getAppendElementPropertySpec({
    title: 'Right Append',
    category: APPEARANCE,
  }),
  focusBorderColor: Type.String({
    title: 'Border Color Of Focusing',
    category: APPEARANCE,
  }),
});

export default implementRuntimeComponent({
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
      focusBorderColor: '',
      isDisabled: false,
      isRequired: false,
      defaultValue: '',
    },
    exampleSize: [4, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {
      setInputValue: Type.Object({
        value: Type.String(),
      }),
      resetInputValue: undefined,
    },
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
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
    customStyle,
    elementRef,
  }) => {
    const [value, setValue] = React.useState(defaultValue || ''); // TODO: pin input
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value);

    useEffect(() => {
      mergeState({ value });
    }, [mergeState, value]);

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
    }, [defaultValue, subscribeMethods]);
    return (
      <InputGroup size={size} background="white" ref={elementRef}>
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
          className={css`
            ${customStyle?.content}
          `}
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
  }
);
