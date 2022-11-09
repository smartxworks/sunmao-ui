import React, { useEffect, useRef } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

type NumberFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.NumberField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/number': {};
  }
}

export const NumberField: React.FC<WidgetProps<NumberFieldType>> = props => {
  const { value, onChange } = props;
  const [stringValue, setStringValue] = React.useState(String(value));
  const numValue = useRef<number>(value);

  useEffect(() => {
    // Convert value to number after switch from expression widget mode.
    if (value !== undefined && typeof value !== 'number') {
      const num = Number(value) || 0;
      onChange(num);
      setStringValue(String(num));
      numValue.current = num;
    }
  }, [onChange, value]);

  return (
    <NumberInput
      value={stringValue}
      onChange={(stringValue, numberValue) => {
        setStringValue(stringValue);
        numValue.current = numberValue;
      }}
      onBlur={() => {
        if (stringValue === '') {
          onChange(undefined);
        } else {
          onChange(numValue.current);
        }
      }}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default implementWidget<NumberFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.NumberField,
  },
})(NumberField);
