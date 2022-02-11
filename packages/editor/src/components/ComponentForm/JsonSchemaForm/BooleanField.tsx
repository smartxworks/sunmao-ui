import React, { useEffect } from 'react';
import { FieldProps } from './fields';
import { Switch } from '@chakra-ui/react';

type Props = FieldProps;

const BooleanField: React.FC<Props> = props => {
  const { formData, onChange } = props;

  useEffect(() => {
    if (formData !== undefined && typeof formData !== 'boolean') {
      onChange(false);
    }
  }, [formData, onChange]);

  return (
    <Switch isChecked={formData} onChange={evt => onChange(evt.currentTarget.checked)} />
  );
};

export default BooleanField;
