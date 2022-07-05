import React from 'react';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { IconButton, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { parseTypeBox, CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';
import { ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { TSchema, Type, Static } from '@sinclair/typebox';
import { ArrayTable } from '../Form/ArrayTable';
import { ArrayItemBox } from '../Form/ArrayItemBox';

const ArrayFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
  displayedKeys: Type.Optional(Type.Array(Type.String())),
});

type ArrayFieldWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.ArrayField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/array': Static<typeof ArrayFieldWidgetOptions>;
  }
}

export const ArrayField: React.FC<WidgetProps<ArrayFieldWidgetType>> = props => {
  const { spec, value, path, level, onChange } = props;
  const { expressionOptions } = spec.widgetOptions || {};
  const itemSpec = Array.isArray(spec.items) ? spec.items[0] : spec.items;

  if (typeof itemSpec === 'boolean' || !itemSpec) {
    return null;
  }

  if (!Array.isArray(value)) {
    return (
      <div>
        Expected array but got
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  }

  const isNotBaseType = itemSpec.type === 'object' || itemSpec.type === 'array';

  return isNotBaseType ? (
    <ArrayTable {...props} itemSpec={itemSpec} />
  ) : (
    <>
      {value.map((itemValue, itemIndex) => (
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
            onChange(value.concat(parseTypeBox(itemSpec as TSchema)));
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
})(ArrayField);
