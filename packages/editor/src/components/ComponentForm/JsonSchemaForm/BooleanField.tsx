import React from 'react';
import { FieldProps } from './fields';
import { Switch } from '@chakra-ui/react';

type Props = FieldProps;

const BooleanField: React.FC<Props> = props => {
  const { formData, onChange } = props;

  return (
    <Switch isChecked={formData} onChange={evt => onChange(evt.currentTarget.checked)} />
  );
};

export default BooleanField;
