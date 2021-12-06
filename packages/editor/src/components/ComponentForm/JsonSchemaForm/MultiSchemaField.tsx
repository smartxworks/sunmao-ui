import React, { useState } from 'react';
import { Box, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import SchemaField from './SchemaField';
import { FieldProps } from './fields';

type Props = FieldProps;

const _Field: React.FC<
  Omit<Props, 'schema'> & { schemas: NonNullable<FieldProps['schema']['anyOf']> }
> = props => {
  const { schemas, formData, onChange, registry } = props;
  const [schemaIdx, setSchemaIdx] = useState(0);

  const subSchema = schemas[schemaIdx];
  if (typeof subSchema === 'boolean') {
    return null;
  }

  return (
    <Box>
      <RadioGroup mb={1} value={schemaIdx} onChange={v => setSchemaIdx(parseInt(v))}>
        <Stack direction="row">
          {schemas.map((s, idx) => {
            if (typeof s === 'boolean') {
              return null;
            }
            return (
              <Radio key={idx} value={idx} borderColor="gray.200">
                {s.type}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
      <SchemaField
        schema={subSchema}
        registry={registry}
        label={subSchema.title || ''}
        formData={formData}
        onChange={value => onChange(value)}
      />
    </Box>
  );
};

const MultiSchemaField: React.FC<Props> = props => {
  const { schema, formData, onChange, registry } = props;

  if (schema.anyOf) {
    return (
      <_Field
        formData={formData}
        onChange={onChange}
        schemas={schema.anyOf}
        registry={registry}
      />
    );
  }

  if (schema.oneOf) {
    return (
      <_Field
        formData={formData}
        onChange={onChange}
        schemas={schema.oneOf}
        registry={registry}
      />
    );
  }

  return null;
};

export default MultiSchemaField;
