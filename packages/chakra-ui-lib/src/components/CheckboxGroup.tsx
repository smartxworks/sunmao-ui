import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Box, CheckboxGroup as BaseCheckboxGroup } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { SizePropertySchema, IsDisabledSchema } from './Checkbox';
import { BASIC } from './constants/category';

const DefaultValueSchema = Type.Array(Type.Union([Type.String(), Type.Number()]), {
  title: 'Default Value',
  description: 'The default value of the checkbox group to be checked',
  category: BASIC,
});

const StateSchema = Type.Object({
  value: DefaultValueSchema,
});

const PropsSchema = Type.Object({
  defaultValue: DefaultValueSchema,
  isDisabled: IsDisabledSchema,
  size: SizePropertySchema,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'checkbox_group',
    displayName: 'Checkbox Group',
    description: 'chakra-ui checkbox group',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      size: '',
      isDisabled: false,
      defaultValue: [],
    },
    exampleSize: [3, 3],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: ['content'],
    styleSlots: [],
    events: [],
  },
})(({ size, defaultValue, isDisabled, slotsElements, mergeState, elementRef }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  return (
    <Box ref={elementRef}>
      <BaseCheckboxGroup
        size={size}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        onChange={val => setValue(val)}
      >
        {slotsElements.content}
      </BaseCheckboxGroup>
    </Box>
  );
});
