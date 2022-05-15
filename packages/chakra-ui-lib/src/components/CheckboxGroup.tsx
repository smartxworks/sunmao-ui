import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { Box, CheckboxGroup as BaseCheckboxGroup } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { SizePropertySpec, IsDisabledSpec } from './Checkbox';
import { BASIC } from './constants/category';

const DefaultValueSpec = Type.Array(Type.Union([Type.String(), Type.Number()]), {
  title: 'Default Value',
  description: 'The default value of the checkbox group to be checked',
  category: BASIC,
});

const StateSpec = Type.Object({
  value: DefaultValueSpec,
});

const PropsSpec = Type.Object({
  defaultValue: DefaultValueSpec,
  isDisabled: IsDisabledSpec,
  size: SizePropertySpec,
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
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
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
        {slotsElements.content ? slotsElements.content({}) : null}
      </BaseCheckboxGroup>
    </Box>
  );
});
