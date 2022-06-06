import { useEffect } from 'react';
import { Static, Type } from '@sinclair/typebox';
import { Select as BaseMultiSelect } from 'chakra-react-select';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, APPEARANCE } from './constants/category';

const StateSpec = Type.Object({
  value: Type.Array(Type.String()),
});

const OptionsSpec = Type.Array(
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
);

const PropsSpec = Type.Object({
  options: OptionsSpec,
  placeholder: Type.String({
    title: 'Placeholder',
    category: BASIC,
  }),
  defaultValue: Type.Array(
    Type.Object({
      label: Type.String(),
      value: Type.String(),
    }),
    {
      title: 'Default Value',
      category: BASIC,
    }
  ),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BEHAVIOR,
  }),
  isRequired: Type.Boolean({
    title: 'Required',
    category: BEHAVIOR,
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
  placeholder: '',
  defaultValue: [],
  isDisabled: false,
  isRequired: false,
  size: 'md',
  variant: 'outline',
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

    const onChange = (options: Static<typeof OptionsSpec>) => {
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
