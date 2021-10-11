import { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { CheckboxGroup as BaseCheckboxGroup } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import Slot from '../_internal/Slot';
import { SizePropertySchema, IsDisabledSchema } from './Checkbox';

const DefaultValueSchema = Type.Optional(
  Type.Array(Type.Union([Type.String(), Type.Number()]))
);

const StateSchema = Type.Object({
  value: Type.String(),
});

const CheckboxGroup: ComponentImplementation<Static<typeof PropsSchema>> = ({
  size,
  defaultValue,
  isDisabled,
  slotsMap,
  mergeState,
}) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseCheckboxGroup
      size={size}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      onChange={val => setValue(val)}
    >
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseCheckboxGroup>
  );
};

const PropsSchema = Type.Object({
  size: SizePropertySchema,
  isDisabled: IsDisabledSchema,
  defaultValue: DefaultValueSchema,
});

export default {
  ...createComponent({
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
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: ['content'],
      styleSlots: [],
      events: [],
    },
  }),
  impl: CheckboxGroup,
};
