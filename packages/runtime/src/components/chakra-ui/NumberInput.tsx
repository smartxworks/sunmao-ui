import React, { useState, useEffect } from 'react';
import {
  NumberInput as BaseNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../registry';

const NumberInput: ComponentImplementation<Static<typeof PropsSchema>> = ({
  defaultValue = 0,
  min,
  max,
  step,
  precision,
  clampValueOnBlur = true,
  allowMouseWheel = false,
  size,
  customerIncrement,
  customerDecrement,
  mergeState,
  subscribeMethods,
}) => {
  const [value, setValue] = useState(defaultValue);
  const onChange = (_: string, valueAsNumber: number) =>
    setValue(valueAsNumber || 0);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  useEffect(() => {
    setValue(defaultValue || 0);
  }, [defaultValue]);

  useEffect(() => {
    subscribeMethods({
      setInputValue({ value }) {
        setValue(value);
      },
      resetInputValue() {
        setValue(defaultValue);
      },
    });
  }, []);

  return (
    <BaseNumberInput
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      precision={precision}
      clampValueOnBlur={clampValueOnBlur}
      allowMouseWheel={allowMouseWheel}
      size={size}
      onChange={onChange}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper {...customerIncrement} />
        <NumberDecrementStepper {...customerDecrement} />
      </NumberInputStepper>
    </BaseNumberInput>
  );
};

const PropsSchema = Type.Object({
  defaultValue: Type.Optional(Type.Number()),
  min: Type.Optional(Type.Number()),
  max: Type.Optional(Type.Number()),
  step: Type.Optional(Type.Number()),
  precision: Type.Optional(Type.Number()),
  clampValueOnBlur: Type.Optional(Type.Boolean()),
  allowMouseWheel: Type.Optional(Type.Boolean()),
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
      xs: Type.String(),
    })
  ),
  customerIncrement: Type.Object({
    bg: Type.Optional(Type.String()),
    children: Type.Optional(Type.String()),
    _active: Type.Object(Type.Object({ bg: Type.String() })),
  }),
  customerDecrement: Type.Object({
    bg: Type.Optional(Type.String()),
    children: Type.Optional(Type.String()),
    _active: Type.Object(Type.Object({ bg: Type.String() })),
  }),
});

const StateSchema = Type.Object({
  value: Type.Number(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'number_input',
      description: 'chakra_ui number input',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [
        {
          name: 'setInputValue',
          parameters: Type.Object({
            value: Type.Number(),
          }),
        },
        {
          name: 'resetInputValue',
        },
      ],
    },
  }),
  impl: NumberInput,
};
