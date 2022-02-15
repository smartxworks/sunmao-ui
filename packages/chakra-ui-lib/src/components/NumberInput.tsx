import { useState, useEffect } from 'react';
import {
  NumberInput as BaseNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR, APPEARANCE } from './constants/category';

const PropsSchema = Type.Object({
  defaultValue: Type.Number({
    title: 'Default Value',
    category: BASIC,
  }),
  min: Type.Number({
    title: 'Min',
    category: BASIC,
  }),
  max: Type.Number({
    title: 'Max',
    category: BASIC,
  }),
  step: Type.Number({
    title: 'Step',
    description: 'The amount to increase or decrease the value by.',
    category: BASIC,
  }),
  precision: Type.Number({
    title: 'Precision',
    category: BASIC,
  }),
  clampValueOnBlur: Type.Boolean({
    title: 'Clamp Value On Blur',
    category: BEHAVIOR,
  }),
  allowMouseWheel: Type.Boolean({
    title: 'Allow Mouse Wheel',
    description: 'Whether or not to allow the mouse wheel to control the number input.',
    category: BEHAVIOR,
  }),
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
      xs: Type.String(),
    }),
    {
      title: 'Size',
      category: APPEARANCE,
    }
  ),
  customerIncrement: Type.Optional(Type.Object(
    {
      bg: Type.String({
        title: 'Background',
      }),
      children: Type.String({
        title: 'Text',
      }),
      _active: Type.Object({
        bg: Type.String({
          title: 'Active Background',
        }),
      }, {
        title: 'Active',
      }),
    },
    {
      title: 'Increment Button',
      category: APPEARANCE,
    }
  )),
  customerDecrement: Type.Optional(Type.Object(
    {
      bg: Type.String({
        title: 'Background',
      }),
      children: Type.String({
        title: 'Text',
      }),
      _active: Type.Object(
        {
          bg: Type.String({
            title: 'Active Background',
          }),
        },
        {
          title: 'Active',
        }
      ),
    },
    {
      title: 'Decrement Button',
      category: APPEARANCE,
    }
  )),
});

const StateSchema = Type.Object({
  value: Type.Number(),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'numberInput',
    description: 'chakra_ui number input',
    displayName: 'Number Input',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      defaultValue: 0,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER,
      step: 1,
      precision: 0,
      clampValueOnBlur: false,
      allowMouseWheel: false,
      size: 'md',
    },
    exampleSize: [4, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {
      setInputValue: Type.Object({
        value: Type.Number(),
      }),
      resetInputValue: undefined,
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
    elementRef,
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
        ref={elementRef}
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
