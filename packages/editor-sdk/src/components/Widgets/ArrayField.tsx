import React from 'react';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { IconButton, Flex, Code } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
  generateDefaultValueFromSpec,
  CORE_VERSION,
  CoreWidgetName,
} from '@sunmao-ui/shared';
import { ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { Type, Static } from '@sinclair/typebox';
import { ArrayTable } from '../Form/ArrayTable';
import { ArrayItemBox } from '../Form/ArrayItemBox';

const ArrayFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
  displayedKeys: Type.Optional(Type.Array(Type.String())),
  appendToBody: Type.Optional(Type.Boolean()),
  appendToParent: Type.Optional(Type.Boolean()),
});

type ArrayFieldWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.ArrayField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/array': Static<typeof ArrayFieldWidgetOptions>;
  }
}

export const ArrayField: React.FC<WidgetProps<ArrayFieldWidgetType>> = props => {
  const { spec, path, value: rawValue, level, onChange, services } = props;
  const { expressionOptions } = spec.widgetOptions || {};
  const itemSpec = Array.isArray(spec.items) ? spec.items[0] : spec.items;
  let value = rawValue;

  if (typeof itemSpec === 'boolean' || !itemSpec) {
    return null;
  }

  if (!Array.isArray(rawValue)) {
    const evaledValue = services.stateManager.deepEval(rawValue, {
      scopeObject: {},
      overrideScope: true,
      fallbackWhenError: exp => exp,
    });
    if (!Array.isArray(evaledValue)) {
      return (
        <div>
          Failed to convert <Code>{rawValue}</Code> to Array.
        </div>
      );
    }

    value = evaledValue;
  }
  const isNotBaseType = itemSpec.type === 'object' || itemSpec.type === 'array';

  return isNotBaseType ? (
    <ArrayTable {...props} value={value} itemSpec={itemSpec} />
  ) : (
    <>
      {value.map((itemValue: any, itemIndex: number) => (
        <ArrayItemBox key={itemIndex} index={itemIndex} value={value} onChange={onChange}>
          <SpecWidget
            {...props}
            value={itemValue}
            spec={mergeWidgetOptionsIntoSpec<'core/v1/spec'>(
              {
                ...itemSpec,
                title: isNotBaseType ? '' : itemSpec.title,
              },
              {
                expressionOptions,
              }
            )}
            path={path.concat(String(itemIndex))}
            level={level + 1}
            onChange={(newItemValue: any) => {
              const newValue = [...value];
              newValue[itemIndex] = newItemValue;
              onChange(newValue);
            }}
          />
        </ArrayItemBox>
      ))}
      <Flex justify="end">
        <IconButton
          aria-label="add"
          icon={<AddIcon />}
          size="sm"
          onClick={() => {
            onChange(value.concat(generateDefaultValueFromSpec(itemSpec)));
          }}
        />
      </Flex>
    </>
  );
};

export default implementWidget<ArrayFieldWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.ArrayField,
  },
  spec: {
    options: ArrayFieldWidgetOptions,
  },
})(ArrayField);
