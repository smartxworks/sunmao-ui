import React from 'react';
import { FieldProps } from './fields';

type Props = FieldProps;

const UnsupportedField: React.FC<Props> = props => {
  const { schema, formData } = props;

  return (
    <div>
      Unsupported field schema
      <pre>{JSON.stringify(schema, null, 2)}</pre>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default UnsupportedField;
