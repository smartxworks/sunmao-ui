import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types/widget';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import { shouldRender } from '../../utils/condition';

const ObjectFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type ObjectFieldWidgetOptionsType = Static<typeof ObjectFieldWidgetOptions>;

export const ObjectField: React.FC<WidgetProps<ObjectFieldWidgetOptionsType>> = props => {
  const { component, schema, value, services, path, level, onChange } = props;
  const { expressionOptions } = schema.widgetOptions || {};

  const properties = Object.keys(schema.properties || {});
  return (
    <>
      {properties.map(name => {
        const subSchema = (schema.properties || {})[name] as WidgetProps['schema'];
        if (typeof subSchema === 'boolean') {
          return null;
        }
        return shouldRender(subSchema.conditions || [], value) ? (
          <SchemaField
            component={component}
            key={name}
            schema={mergeWidgetOptionsIntoSchema(
              {
                ...subSchema,
                title: subSchema.title || name,
              },
              {
                expressionOptions,
              }
            )}
            path={path.concat(name)}
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
        ) : null;
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
