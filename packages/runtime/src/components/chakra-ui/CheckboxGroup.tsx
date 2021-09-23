import { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { CheckboxGroup as BaseCheckboxGroup } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
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
      onChange={val => setValue(val)}>
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
      description: 'chakra-ui checkbox group',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: CheckboxGroup,
};
