import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { RadioGroup as BaseRadioGroup } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';

const DefaultValueSchema = Type.Union([Type.String(), Type.Number()]);
const IsNumericalSchema = Type.Optional(Type.Boolean());
const StateSchema = Type.Object({
  value: Type.String(),
});

const RadioGroup: ComponentImplementation<{
  defaultValue?: Static<typeof DefaultValueSchema>;
  isNumerical?: Static<typeof IsNumericalSchema>;
}> = ({ defaultValue, isNumerical, slotsMap, mergeState }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseRadioGroup
      value={value}
      onChange={val => setValue(isNumerical ? Number(val) : val)}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseRadioGroup>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'radio_group',
      description: 'chakra-ui radio group',
    },
    spec: {
      properties: [
        {
          name: 'defaultValue',
          ...DefaultValueSchema,
        },
        {
          name: 'isNumerical',
          ...IsNumericalSchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: RadioGroup,
};
