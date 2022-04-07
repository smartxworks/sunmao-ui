import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
import { ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { shouldRender } from '../../utils/condition';

const ObjectFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
});

type ObjectFieldWidgetOptionsType = Static<typeof ObjectFieldWidgetOptions>;

export const ObjectField: React.FC<WidgetProps<ObjectFieldWidgetOptionsType>> = props => {
  const { component, spec, value, services, path, level, onChange } = props;
  const { expressionOptions } = spec.widgetOptions || {};

  const properties = Object.keys(spec.properties || {});
  return (
    <>
      {properties.map(name => {
        const subSpec = (spec.properties || {})[name] as WidgetProps['spec'];
        if (typeof subSpec === 'boolean') {
          return null;
        }
        return shouldRender(subSpec.conditions || [], value) ? (
          <SpecWidget
            component={component}
            key={name}
            spec={mergeWidgetOptionsIntoSpec(
              {
                ...subSpec,
                title: subSpec.title || name,
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
    name: 'object',
  },
  spec: {
    options: ObjectFieldWidgetOptions,
  },
})(ObjectField);
