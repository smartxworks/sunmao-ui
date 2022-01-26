import React, { useState, useEffect } from 'react';
import { FieldProps } from './fields';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

type Props = FieldProps;

const NumberField: React.FC<Props> = props => {
  const { formData, onChange } = props;
  const [value, setValue] = useState(String(formData));

  useEffect(() => {
    setValue(String(formData));
  }, [formData]);

  return (
    <NumberInput
      value={value}
      onChange={(vas, van) => {
        setValue(vas);
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

export default NumberField;
