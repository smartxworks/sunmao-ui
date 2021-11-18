import React from 'react';
import SchemaField from './SchemaField';
import { FieldProps } from './fields';

type Props = FieldProps;

const ObjectField: React.FC<Props> = props => {
  const { schema, formData, onChange } = props;

  const properties = Object.keys(schema.properties || {});
  return (
    <>
      {properties.map(name => {
        const subSchema = (schema.properties || {})[name];
        if (typeof subSchema === 'boolean') {
          return null;
        }
        return (
          <SchemaField
            key={name}
            schema={subSchema}
            label={subSchema.title || name}
            formData={formData ? formData[name] : undefined}
            onChange={value =>
              onChange({
                ...formData,
                [name]: value,
              })
            }
          />
        );
      })}
    </>
  );
};

export default ObjectField;
