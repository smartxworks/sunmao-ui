import React from 'react';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import { Box, ButtonGroup, IconButton, Flex } from '../UI';
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { TSchema, Type, Static } from '@sinclair/typebox';

function swap<T>(arr: Array<T>, i1: number, i2: number): Array<T> {
  const tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
  return arr;
}

const ArrayFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type ArrayFieldWidgetOptionsType = Static<typeof ArrayFieldWidgetOptions>;

export const ArrayField: React.FC<WidgetProps<ArrayFieldWidgetOptionsType>> = props => {
  const { component, schema, value, services, level, onChange } = props;
  const { expressionOptions } = schema.widgetOptions || {};
  const subSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
  if (typeof subSchema === 'boolean' || !subSchema) {
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
  return (
    <>
      {value.map((v, idx) => {
        return (
          <Box
            key={idx}
            mb={2}
            border="1px solid black"
            borderColor="gray.200"
            borderRadius="4"
            padding="8px"
          >
            <ButtonGroup
              spacing={0}
              size="xs"
              variant="ghost"
              display="flex"
              justifyContent="end"
            >
              <IconButton
                aria-label={`up-${idx}`}
                icon={<ArrowUpIcon />}
                disabled={idx === 0}
                onClick={() => {
                  const newFormData = [...value];
                  swap(newFormData, idx, idx - 1);
                  onChange(newFormData);
                }}
              />
              <IconButton
                aria-label={`down-${idx}`}
                icon={<ArrowDownIcon />}
                disabled={idx === value.length - 1}
                onClick={() => {
                  const newFormData = [...value];
                  swap(newFormData, idx, idx + 1);
                  onChange(newFormData);
                }}
              />
              <IconButton
                aria-label={`delete-${idx}`}
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => {
                  const newFormData = [...value];
                  newFormData.splice(idx, 1);
                  onChange(newFormData);
                }}
              />
            </ButtonGroup>
            <SchemaField
              component={component}
              schema={mergeWidgetOptionsIntoSchema(subSchema, { expressionOptions })}
              value={v}
              level={level + 1}
              services={services}
              onChange={newValue => {
                const newFormData = [...value];
                newFormData[idx] = newValue;
                onChange(newFormData);
              }}
            />
          </Box>
        );
      })}
      <Flex justify="end">
        <IconButton
          aria-label="add"
          icon={<AddIcon />}
          size="sm"
          onClick={() => {
            onChange(value.concat(parseTypeBox(subSchema as TSchema)));
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
