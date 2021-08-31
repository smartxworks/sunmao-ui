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

const DefaultValuePropertySchema = Type.Optional(Type.Number());
const MinPropertySchema = Type.Optional(Type.Number());
const MaxPropertySchema = Type.Optional(Type.Number());
const StepPropertySchema = Type.Optional(Type.Number());
const PrecisionPropertySchema = Type.Optional(Type.Number());
const ClampValueOnBlurPropertySchema = Type.Optional(Type.Boolean());
const AllowMouseWheelPropertySchema = Type.Optional(Type.Boolean());

const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
    xs: Type.String(),
  })
);

const CustomerStepStylePropertySchema = Type.Object({
  bg: Type.Optional(Type.String()),
  children: Type.Optional(Type.String()),
  _active: Type.Object(Type.Object({ bg: Type.String() })),
});

const NumberInput: ComponentImplementation<{
  defaultValue?: Static<typeof DefaultValuePropertySchema>;
  min?: Static<typeof MinPropertySchema>;
  max?: Static<typeof MaxPropertySchema>;
  step?: Static<typeof StepPropertySchema>;
  precision?: Static<typeof PrecisionPropertySchema>;
  clampValueOnBlur?: Static<typeof ClampValueOnBlurPropertySchema>;
  allowMouseWheel?: Static<typeof AllowMouseWheelPropertySchema>;
  size?: Static<typeof SizePropertySchema>;
  customerIncrement?: Static<typeof CustomerStepStylePropertySchema>;
  customerDecrement?: Static<typeof CustomerStepStylePropertySchema>;
}> = ({
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
}) => {
  const [value, setValue] = useState(defaultValue);
  const onChange = (valueAsString: string, valueAsNumber: number) =>
    setValue(valueAsNumber);

  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseNumberInput
      defaultValue={defaultValue}
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
      properties: [
        {
          name: 'defaultValue',
          ...DefaultValuePropertySchema,
        },
        {
          name: 'min',
          ...MinPropertySchema,
        },
        {
          name: 'max',
          ...MaxPropertySchema,
        },
        {
          name: 'step',
          ...StepPropertySchema,
        },
        {
          name: 'precision',
          ...PrecisionPropertySchema,
        },
        {
          name: 'clampValueOnBlur',
          ...ClampValueOnBlurPropertySchema,
        },
        {
          name: 'allowMouseWheel',
          ...AllowMouseWheelPropertySchema,
        },
        {
          name: 'size',
          ...SizePropertySchema,
        },
        {
          name: 'customerIncrement',
          ...CustomerStepStylePropertySchema,
        },
        {
          name: 'customerDecrement',
          ...CustomerStepStylePropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: NumberInput,
};
