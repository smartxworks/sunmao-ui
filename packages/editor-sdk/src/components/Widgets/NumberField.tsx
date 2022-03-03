import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '../UI';

export const NumberField: React.FC<WidgetProps> = props => {
  const { value, onChange } = props;
  const [stringValue, setStringValue] = React.useState(String(value));

  return (
    <NumberInput
      value={stringValue}
      onChange={(stringValue, numberValue) => {
        setStringValue(stringValue);
        if (value !== undefined && typeof value !== 'number') {
          onChange(1);
        } else {
          onChange(numberValue);
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

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'NumberField',
  },
})(NumberField);
