import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { CheckboxGroup as BaseCheckboxGroup } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { SizePropertySchema, IsDisabledSchema } from './Checkbox';

const DefaultValueSchema = Type.Array(Type.Union([Type.String(), Type.Number()]));

const StateSchema = Type.Object({
  value: DefaultValueSchema,
});

const PropsSchema = Type.Object({
  size: SizePropertySchema,
  isDisabled: IsDisabledSchema,
  defaultValue: Type.Optional(DefaultValueSchema),
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
      defaultValue: [],
    },
    exampleSize: [3, 3],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: ['content'],
    styleSlots: [],
    events: [],
  },
})(({ size, defaultValue, isDisabled, Slot, mergeState }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  return (
    <BaseCheckboxGroup
      size={size}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      onChange={val => setValue(val)}
    >
      <Slot slot="content" />
    </BaseCheckboxGroup>
  );
});
