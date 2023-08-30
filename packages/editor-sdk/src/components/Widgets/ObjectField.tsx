import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
import { ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { shouldRender } from '../../utils/condition';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';
import { VStack } from '@chakra-ui/react';

const ObjectFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
  ignoreKeys: Type.Optional(Type.Array(Type.String())),
});

type ObjectFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.ObjectField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/object': Static<typeof ObjectFieldWidgetOptions>;
  }
}

export const ObjectField: React.FC<WidgetProps<ObjectFieldType>> = props => {
  const { component, spec, value, services, path, level, onChange } = props;
  const { expressionOptions, ignoreKeys = [] } = spec.widgetOptions || {};

  const properties = Object.keys(spec.properties || {});
  return (
    <VStack spacing="0" paddingLeft={level > 0 ? 3 : 0}>
      {properties.map(name => {
        const subSpec = (spec.properties || {})[name] as WidgetProps['spec'];

        if (typeof subSpec === 'boolean' || ignoreKeys.includes(name)) {
          return null;
        }

        return shouldRender(
          subSpec.conditions || [],
          services.stateManager.deepEval(value)
        ) ? (
          <SpecWidget
            component={component}
            key={name + component.id}
            spec={mergeWidgetOptionsIntoSpec<'core/v1/spec'>(
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
    </VStack>
  );
};

export default implementWidget<ObjectFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.ObjectField,
  },
  spec: {
    options: ObjectFieldWidgetOptions,
  },
})(ObjectField);
