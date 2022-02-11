import { useEffect } from 'react';
import { Static, Type } from '@sinclair/typebox';
import { Select as BaseMultiSelect } from 'chakra-react-select';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';

const StateSchema = Type.Object({
  value: Type.Array(Type.String()),
});

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

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'multiSelect',
    displayName: 'MultiSelect',
    description: 'chakra-ui MultiSelect',
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
    isRequired,
    isDisabled,
    size,
    variant,
    mergeState,
    customStyle,
    elementRef,
  }) => {
    useEffect(() => {
      const newValue = (defaultValue || []).map(o => o.value);
      mergeState({ value: newValue });
    }, [defaultValue, mergeState]);

    const onChange = (options: Static<typeof OptionsSchema>) => {
      const newValue = options.map(o => o.value);
      mergeState({ value: newValue });
    };

    return (
      <Box
        width="full"
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
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
  }
);
