import React, { useState } from 'react';
import { FieldProps } from './fields';
import { Input, Select } from '@chakra-ui/react';

type Props = FieldProps;

const StringField: React.FC<Props> = props => {
  const { schema, formData, onChange } = props;
  const [value, setValue] = useState(formData);

  // enum
  if (Array.isArray(schema.enum)) {
    return (
      <Select value={formData} onChange={evt => onChange(evt.currentTarget.value)}>
        {schema.enum.map((item, idx) => {
          const value = item?.toString() || '';
          return <option key={idx}>{value}</option>;
        })}
      </Select>
    );
  }

  return (
    <Input
      value={value}
      onChange={evt => setValue(evt.currentTarget.value)}
      onBlur={evt => onChange(evt.currentTarget.value)}
    />
  );
};

export default StringField;
