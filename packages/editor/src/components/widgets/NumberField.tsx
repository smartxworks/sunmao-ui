import React, { useEffect } from 'react';
import { WidgetProps } from '../../types';
import { implementWidget } from '../../utils/widget';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

export const NumberField: React.FC<WidgetProps> = props => {
  const { value, onChange } = props;

  useEffect(() => {
    if (value !== undefined && typeof value !== 'number') {
      onChange(1);
    }
  }, [value, onChange]);

  return (
    <NumberInput
      value={value}
      onChange={(_, van) => {
        onChange(van);
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
