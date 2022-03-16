import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { implementWidget, WidgetProps, SchemaField } from '@sunmao-ui/editor-sdk';

export const TableColumnWidget: React.FC<WidgetProps> = props => {
  const { value, level, path, schema, component, services, onChange } = props;
  const { type } = value;
  const properties = schema.properties || {};
  const TYPE_MAP: Record<string, boolean> = {
    buttonConfig: type === 'button',
    module: type === 'module',
  };
  const propertyKeys = Object.keys(properties).filter(key => TYPE_MAP[key] !== false);
  const schemas: JSONSchema7[] = propertyKeys.map(key => properties[key] as JSONSchema7);

  return (
    <>
      {schemas.map((propertySchema, index) => {
        const key = propertyKeys[index];

        return (
          <SchemaField
            key={key}
            component={component}
            services={services}
            schema={propertySchema}
            value={value[key]}
            level={level + 1}
            path={path.concat(key)}
            onChange={propertyValue => {
              const result = {
                ...value,
                [key]: propertyValue,
              };

              onChange(result);
            }}
          />
        );
      })}
    </>
  );
};

export default implementWidget({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'TableColumn',
  },
})(TableColumnWidget);
