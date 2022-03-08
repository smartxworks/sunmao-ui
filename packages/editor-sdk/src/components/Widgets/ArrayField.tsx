import React from 'react';
import { SchemaField } from './SchemaField';
import { PopoverWidget } from './PopoverWidget';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import {
  Box,
  ButtonGroup,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { TSchema, Type, Static } from '@sinclair/typebox';
import { css } from '@emotion/css';

const TableWrapperStyle = css`
  border: 1px solid var(--chakra-colors-gray-200);
  border-radius: var(--chakra-radii-sm);
`;

const TableRowStyle = css`
  & > th,
  & > td {
    padding-inline-start: var(--chakra-space-1);
    padding-inline-end: var(--chakra-space-1);
    padding-top: var(--chakra-space-1);
    padding-bottom: var(--chakra-space-1);
    border-bottom-width: 1px;
    border-color: var(--chakra-colors-gray-100);
  }
`;

function swap<T>(arr: Array<T>, i1: number, i2: number): Array<T> {
  const tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
  return arr;
}

const ArrayFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
  displayedKeys: Type.Optional(Type.Array(Type.String())),
});

type ArrayFieldWidgetOptionsType = Static<typeof ArrayFieldWidgetOptions>;

export const ArrayField: React.FC<WidgetProps<ArrayFieldWidgetOptionsType>> = props => {
  const { component, schema, value, services, path, level, onChange } = props;
  const { expressionOptions, displayedKeys = [] } = schema.widgetOptions || {};
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

  const isNotBaseType = subSchema.type === 'object' || subSchema.type === 'array';
  const itemInfos = value.map((v, idx) => {
    const props = {
      component,
      schema: mergeWidgetOptionsIntoSchema(
        {
          ...subSchema,
          title: isNotBaseType ? '' : subSchema.title,
        },
        {
          expressionOptions,
        }
      ),
      value: v,
      path: path.concat(String(idx)),
      level: level + 1,
      services,
      onChange: (newValue: any) => {
        const newFormData = [...value];
        newFormData[idx] = newValue;
        onChange(newFormData);
      },
    };
    const buttons = (
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
    );

    return {
      props,
      buttons,
    };
  });

  return isNotBaseType ? (
    <div className={TableWrapperStyle}>
      <Table size="sm">
        <Thead>
          <Tr className={TableRowStyle}>
            <Th width="24px" />
            {displayedKeys.length ? (
              displayedKeys.map((key: string) => {
                const propertySchema = subSchema.properties?.[key];

                return propertySchema && typeof propertySchema !== 'boolean' ? (
                  <Th key={key}>{propertySchema.title ?? key}</Th>
                ) : null;
              })
            ) : (
              <Th key="index">Index</Th>
            )}
            <Th key="button" display="flex" justifyContent="end">
              <IconButton
                aria-label="add"
                icon={<AddIcon />}
                size="xs"
                variant="ghost"
                onClick={() => {
                  onChange(value.concat(parseTypeBox(subSchema as TSchema)));
                }}
              />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {itemInfos.map((itemInfo, idx) => (
            <Tr key={idx} className={TableRowStyle}>
              <Td key="setting">
                <PopoverWidget {...itemInfo.props} />
              </Td>
              {displayedKeys.length ? (
                displayedKeys.map(key => {
                  const propertySchema = subSchema.properties?.[key];
                  const propertyValue = value[idx][key];

                  return propertySchema && typeof propertySchema !== 'boolean' ? (
                    <Td key={key}>{propertyValue}</Td>
                  ) : null;
                })
              ) : (
                <Td key="index">{idx}</Td>
              )}
              <Td key="button">{itemInfo.buttons}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  ) : (
    <>
      {itemInfos.map((itemInfo, idx) => (
        <Box
          key={idx}
          mb={2}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="4"
          padding="8px"
        >
          {itemInfo.buttons}
          <SchemaField {...itemInfo.props} />
        </Box>
      ))}
    </>
  );
};

export default implementWidget<ArrayFieldWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'ArrayField',
  },
})(ArrayField);
