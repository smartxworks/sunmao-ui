import { useEffect } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Select as BaseMultiSelect } from 'chakra-react-select';
import { ComponentImplementation } from '../../services/registry';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';

const StateSchema = Type.Object({
  value: Type.String(),
});

const MultiSelect: ComponentImplementation<Static<typeof PropsSchema>> = ({
  options,
  placeholder,
  defaultValue,
  isRequired,
  isDisabled,
  size,
  variant,
  mergeState,
  customStyle,
}) => {
  useEffect(() => {
    const newValue = (defaultValue || []).map(o => o.value);
    mergeState({ value: newValue });
  }, []);

  const onChange = (options: Static<typeof OptionsSchema>) => {
    const newValue = options.map(o => o.value);
    mergeState({ value: newValue });
  };

  return (
    <Box
      width="full"
      css={css`
        ${customStyle?.content}
      `}
    >
      <BaseMultiSelect
        isMulti
        options={options}
        placeholder={placeholder}
        isRequired={isRequired}
        isDisabled={isDisabled}
        size={size}
        variant={variant}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </Box>
  );
};

const OptionsSchema = Type.Array(
  Type.Object({
    label: Type.String(),
    value: Type.String(),
  })
);

const PropsSchema = Type.Object({
  options: OptionsSchema,
  placeholder: Type.Optional(Type.String()),
  defaultValue: Type.Optional(
    Type.Array(
      Type.Object({
        label: Type.String(),
        value: Type.String(),
      })
    )
  ),
  isDisabled: Type.Optional(Type.Boolean()),
  isRequired: Type.Optional(Type.Boolean()),
  size: Type.KeyOf(
    Type.Object({
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

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'multiSelect',
      displayName: 'MultiSelect',
      description: 'chakra-ui MultiSelect',
      isResizable: true,
      isDraggable: true,
      exampleProperties,
      exampleSize: [4, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: MultiSelect,
};
