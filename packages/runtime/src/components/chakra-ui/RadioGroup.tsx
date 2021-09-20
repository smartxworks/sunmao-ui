import React, { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { RadioGroup as BaseRadioGroup } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';

const StateSchema = Type.Object({
  value: Type.String(),
});

const RadioGroup: ComponentImplementation<Static<typeof PropsSchema>> = ({
  defaultValue,
  isNumerical,
  slotsMap,
  mergeState,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <BaseRadioGroup
      value={value}
      onChange={val => setValue(isNumerical ? Number(val) : val)}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseRadioGroup>
  );
};

const PropsSchema = Type.Object({
  defaultValue: Type.Union([Type.String(), Type.Number()]),
  isNumerical: Type.Optional(Type.Boolean()),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'radio_group',
      description: 'chakra-ui radio group',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: RadioGroup,
};
