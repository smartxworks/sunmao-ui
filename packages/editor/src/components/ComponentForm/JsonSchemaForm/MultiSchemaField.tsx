import React, { useState } from 'react';
import { Select, Box } from '@chakra-ui/react';
import SchemaField from './SchemaField';
import { FieldProps } from './fields';

type Props = FieldProps;

const _Field: React.FC<
  Omit<Props, 'schema'> & { schemas: NonNullable<FieldProps['schema']['anyOf']> }
> = props => {
  const { schemas, formData, onChange } = props;
  const [schemaIdx, setSchemaIdx] = useState(0);

  const subSchema = schemas[schemaIdx];
  if (typeof subSchema === 'boolean') {
    return null;
  }

  return (
    <Box>
      <Select
        mb={1}
        value={schemaIdx}
        onChange={evt => setSchemaIdx(parseInt(evt.currentTarget.value))}
      >
        {schemas.map((s, idx) => {
          if (typeof s === 'boolean') {
            return null;
          }
          const text = s.title ? s.title : `schema${idx + 1}(${s.type})`;
          return (
            <option key={idx} value={idx}>
              {text}
            </option>
          );
        })}
      </Select>
      <SchemaField
        schema={subSchema}
        label={subSchema.title || ''}
        formData={formData}
        onChange={value => onChange(value)}
      />
    </Box>
  );
};

const MultiSchemaField: React.FC<Props> = props => {
  const { schema, formData, onChange } = props;

  if (schema.anyOf) {
    return <_Field formData={formData} onChange={onChange} schemas={schema.anyOf} />;
  }

  if (schema.oneOf) {
    return <_Field formData={formData} onChange={onChange} schemas={schema.oneOf} />;
  }

  return null;
};

export default MultiSchemaField;
