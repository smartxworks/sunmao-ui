import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';

const ObjectFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type ObjectFieldWidgetOptionsType = Static<typeof ObjectFieldWidgetOptions>;

export const ObjectField: React.FC<WidgetProps<ObjectFieldWidgetOptionsType>> = props => {
  const { component, schema, value, services, level, onChange } = props;
  const { expressionOptions } = schema.widgetOptions || {};

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
            component={component}
            key={name}
            schema={mergeWidgetOptionsIntoSchema(subSchema, {
              expressionOptions,
              title: subSchema.title || name,
            })}
            level={level + 1}
            value={value?.[name]}
            services={services}
            onChange={newValue =>
              onChange({
                ...value,
                [name]: newValue,
              })
            }
          />
        );
      })}
    </>
  );
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'ObjectField',
  },
  spec: {
    options: ObjectFieldWidgetOptions,
  },
})(ObjectField);
