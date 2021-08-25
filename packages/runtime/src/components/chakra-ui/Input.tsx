import React, { useEffect } from 'react';
import {
  Input as BaseInput,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../registry';

const VariantPropertySchema = Type.KeyOf(
  Type.Object({
    outline: Type.String(),
    unstyled: Type.String(),
    filled: Type.String(),
    flushed: Type.String(),
  })
);

const PlaceholderPropertySchema = Type.Optional(Type.String());

const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
    xs: Type.String(),
  })
);

const FocusBorderColorPropertySchema = Type.Optional(Type.String());
const IsDisabledPropertySchema = Type.Optional(Type.Boolean());
const IsRequiredPropertySchema = Type.Optional(Type.Boolean());

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

const Input: ComponentImplementation<{
  variant?: Static<typeof VariantPropertySchema>;
  placeholder?: Static<typeof PlaceholderPropertySchema>;
  size?: Static<typeof SizePropertySchema>;
  focusBorderColor?: Static<typeof FocusBorderColorPropertySchema>;
  isDisabled?: Static<typeof IsDisabledPropertySchema>;
  isRequired?: Static<typeof IsRequiredPropertySchema>;
  left?: Static<typeof AppendElementPropertySchema>;
  right?: Static<typeof AppendElementPropertySchema>;
}> = ({
  variant,
  placeholder,
  size,
  focusBorderColor,
  isDisabled,
  isRequired,
  left,
  right,
  mergeState,
  data,
}) => {
  const [value, setValue] = React.useState(''); // TODO: pin input
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  useEffect(() => {
    mergeState({ value });
    mergeState({ data });
  }, [value, data]);

  return (
    <InputGroup size={size}>
      {left ? (
        left.type === 'addon' ? (
          <InputLeftAddon children={left.children} />
        ) : (
          <InputLeftElement
            children={left.children}
            fontSize={left.fontSize}
            color={left.color}
          />
        )
      ) : (
        <></>
      )}
      <BaseInput
        variant={variant}
        placeholder={placeholder}
        focusBorderColor={focusBorderColor}
        isDisabled={isDisabled}
        isRequired={isRequired}
        onChange={onChange}
      />
      {right ? (
        right.type === 'addon' ? (
          <InputRightAddon children={right.children} />
        ) : (
          <InputRightElement
            children={right.children}
            fontSize={right.fontSize}
            color={right.color}
          />
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

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'input',
      description: 'chakra_ui input',
    },
    spec: {
      properties: [
        {
          name: 'variant',
          ...VariantPropertySchema,
        },
        {
          name: 'placeholder',
          ...PlaceholderPropertySchema,
        },
        {
          name: 'size',
          ...SizePropertySchema,
        },
        {
          name: 'focusBorderColor',
          ...FocusBorderColorPropertySchema,
        },
        {
          name: 'isDisabled',
          ...IsDisabledPropertySchema,
        },
        {
          name: 'isRequired',
          ...IsRequiredPropertySchema,
        },
        {
          name: 'left',
          ...AppendElementPropertySchema,
        },
        {
          name: 'right',
          ...AppendElementPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Input,
};
