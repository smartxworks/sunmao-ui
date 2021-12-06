import React from 'react';
import SchemaField from './SchemaField';
import { FieldProps } from './fields';
import { Box } from '@chakra-ui/react';

type Props = FieldProps;

const ObjectField: React.FC<Props> = props => {
  const { schema, formData, onChange, registry } = props;

  const properties = Object.keys(schema.properties || {});
  return (
    <>
      {properties.map(name => {
        const subSchema = (schema.properties || {})[name];
        if (typeof subSchema === 'boolean') {
          return null;
        }
        return (
          <Box key={name}>
            <SchemaField
              schema={subSchema}
              registry={registry}
              label={subSchema.title || name}
              formData={formData?.[name]}
              onChange={value =>
                onChange({
                  ...formData,
                  [name]: value,
                })
              }
            />
          </Box>
        );
      })}
    </>
  );
};

export default ObjectField;
