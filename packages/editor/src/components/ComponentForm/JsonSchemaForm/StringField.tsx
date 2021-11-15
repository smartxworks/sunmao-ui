import React from 'react';
import { FieldProps } from './fields';
import { Input } from '@chakra-ui/react';

type Props = FieldProps;

const StringField: React.FC<Props> = props => {
  const { formData, onChange } = props;

  return <Input value={formData} onChange={evt => onChange(evt.currentTarget.value)} />;
};

export default StringField;
