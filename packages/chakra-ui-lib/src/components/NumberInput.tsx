import { useState, useEffect } from 'react';
import {
  NumberInput as BaseNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent2 } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';

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
    _active: Type.Object({ bg: Type.String() }),
  }),
  customerDecrement: Type.Object({
    bg: Type.Optional(Type.String()),
    children: Type.Optional(Type.String()),
    _active: Type.Object({ bg: Type.String() }),
  }),
});

const StateSchema = Type.Object({
  value: Type.Number(),
});

export default implementRuntimeComponent2({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'number_input',
    description: 'chakra_ui number input',
    displayName: 'Number Input',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      defaultValue: 0,
    },
    exampleSize: [4, 1],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {
      setInputValue: Type.Object({
        value: Type.Number(),
      }),
      resetInputValue: void 0,
    },
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
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
    customStyle,
  }) => {
    const [value, setValue] = useState(defaultValue);
    const onChange = (_: string, valueAsNumber: number) => setValue(valueAsNumber || 0);

    useEffect(() => {
      mergeState({ value });
    }, [mergeState, value]);

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
    }, [defaultValue, subscribeMethods]);

    return (
      <BaseNumberInput
        background="white"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        precision={precision}
        clampValueOnBlur={clampValueOnBlur}
        allowMouseWheel={allowMouseWheel}
        size={size}
        onChange={onChange}
        className={css`
          ${customStyle?.content}
        `}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper {...customerIncrement} />
          <NumberDecrementStepper {...customerDecrement} />
        </NumberInputStepper>
      </BaseNumberInput>
    );
  }
);
