import React, { useState } from 'react';
import { Type, Static } from '@sinclair/typebox';
import { Box, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types/widget';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';

const MultiSchemaFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type MultiSchemaFieldWidgetOptionsType = Static<typeof MultiSchemaFieldWidgetOptions>;

const _Field: React.FC<
  Omit<WidgetProps<MultiSchemaFieldWidgetOptionsType>, 'schema'> & {
    schemas: NonNullable<WidgetProps['schema']['anyOf']>;
  }
> = props => {
  const { component, schemas, value, level, path, services, onChange } = props;
  const [schemaIdx, setSchemaIdx] = useState(0);
  const subSchema: WidgetProps['schema'] | boolean = schemas[schemaIdx];

  if (typeof subSchema === 'boolean') {
    return null;
  }

  const { expressionOptions } = subSchema.widgetOptions || {};

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
        component={component}
        schema={mergeWidgetOptionsIntoSchema(subSchema, { expressionOptions })}
        path={path}
        level={level}
        value={value}
        onChange={newValue => onChange(newValue)}
        services={services}
      />
    </Box>
  );
};

export const MultiSchemaField: React.FC<WidgetProps<MultiSchemaFieldWidgetOptionsType>> =
  props => {
    const { component, schema, value, services, path, level, onChange } = props;

    if (schema.anyOf) {
      return (
        <_Field
          component={component}
          value={value}
          path={path}
          level={level}
          schemas={schema.anyOf}
          services={services}
          onChange={onChange}
        />
      );
    }

    if (schema.oneOf) {
      return (
        <_Field
          component={component}
          value={value}
          path={path}
          level={level}
          schemas={schema.oneOf}
          services={services}
          onChange={onChange}
        />
      );
    }

    return null;
  };

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'MultiSchemaField',
  },
  spec: {
    options: MultiSchemaFieldWidgetOptions,
  },
})(MultiSchemaField);
