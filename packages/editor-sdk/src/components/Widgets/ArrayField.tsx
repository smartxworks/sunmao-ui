import React from 'react';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import {
  IconButton,
  Flex
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { TSchema, Type, Static } from '@sinclair/typebox';
import { ArrayTable } from '../Form/ArrayTable';
import { ArrayItemBox } from '../Form/ArrayItemBox';

const ArrayFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
  displayedKeys: Type.Optional(Type.Array(Type.String())),
});

type ArrayFieldWidgetOptionsType = Static<typeof ArrayFieldWidgetOptions>;

export const ArrayField: React.FC<WidgetProps<ArrayFieldWidgetOptionsType>> = props => {
  const { schema, value, path, level, onChange } = props;
  const { expressionOptions } = schema.widgetOptions || {};
  const itemSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;

  if (typeof itemSchema === 'boolean' || !itemSchema) {
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

  const isNotBaseType = itemSchema.type === 'object' || itemSchema.type === 'array';

  return isNotBaseType ? (
    <ArrayTable {...props} itemSchema={itemSchema} />
  ) : (
    <>
      {value.map((itemValue, itemIndex) => (
        <ArrayItemBox key={itemIndex} index={itemIndex} value={value} onChange={onChange}>
          <SchemaField
            {...props}
            value={itemValue}
            schema={mergeWidgetOptionsIntoSchema(
              {
                ...itemSchema,
                title: isNotBaseType ? '' : itemSchema.title,
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
            onChange(value.concat(parseTypeBox(itemSchema as TSchema)));
          }}
        />
      </Flex>
    </>
  );
};

export default implementWidget<ArrayFieldWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'ArrayField',
  },
})(ArrayField);
