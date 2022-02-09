import React, { useState, useEffect } from 'react';
import { FieldProps } from './fields';
import { Input, Select } from '@chakra-ui/react';

type Props = FieldProps;

const EnumField: React.FC<FieldProps> = props => {
  const { schema, formData, onChange } = props;

  const options = (schema.enum || []).map(item => item?.toString() || '');
  useEffect(() => {
    // reset to valid enum
    if (options.length && !options.includes(formData)) {
      onChange(options[0]);
    }
  }, [options, formData, onChange]);

  return (
    <Select value={formData} onChange={evt => onChange(evt.currentTarget.value)}>
      {options.map((value, idx) => {
        return <option key={idx}>{value}</option>;
      })}
    </Select>
  );
};

const StringField: React.FC<Props> = props => {
  const { schema, formData, onChange } = props;
  const [value, setValue] = useState(formData);

  useEffect(() => {
    setValue(formData);
  }, [formData]);

  // enum
  if (Array.isArray(schema.enum)) {
    return <EnumField {...props} />;
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
