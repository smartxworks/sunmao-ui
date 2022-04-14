import React from 'react';
import { css } from '@emotion/css';
import { IconButton, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { JSONSchema7 } from 'json-schema';
import { TSchema } from '@sinclair/typebox';
import { ArrayButtonGroup } from './ArrayButtonGroup';
import { PopoverWidget } from '../Widgets/PopoverWidget';
import { WidgetProps } from '../../types';
import { isJSONSchema } from '../../utils/schema';
import { mergeWidgetOptionsIntoSpec } from '../../utils/widget';

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

type Props = WidgetProps & {
  itemSpec: JSONSchema7;
};

export const ArrayTable: React.FC<Props> = props => {
  const { value, itemSpec, spec, level, path, children, onChange } = props;
  const { expressionOptions, displayedKeys = [] } = spec.widgetOptions || {};
  const keys = displayedKeys.length ? displayedKeys : ['index'];

  return (
    <div className={TableWrapperStyle}>
      <Table size="sm">
        <Thead>
          <Tr className={TableRowStyle}>
            <Th width="24px" />
            {keys.map((key: string) => {
              const propertySpec = itemSpec.properties?.[key];
              const title = isJSONSchema(propertySpec) ? (propertySpec.title || key) : key;

              return <Th key={key}>{title}</Th>;
            })}
            <Th key="button" display="flex" justifyContent="end">
              <IconButton
                aria-label="add"
                icon={<AddIcon />}
                size="xs"
                variant="ghost"
                onClick={() => {
                  onChange(value.concat(parseTypeBox(itemSpec as TSchema)));
                }}
              />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {value.map((itemValue: any, itemIndex: number) => (
            <Tr key={itemIndex} className={TableRowStyle}>
              <Td key="setting">
                <PopoverWidget
                  {...props}
                  value={itemValue}
                  spec={mergeWidgetOptionsIntoSpec(
                    {
                      ...itemSpec,
                      title: '',
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
                >
                  { typeof children === 'function' ? children(props, itemValue, itemIndex) : null }
                </PopoverWidget>
              </Td>
              {keys.map((key: string) => {
                const propertyValue = key === 'index' ? (itemValue[key] ?? itemIndex) : itemValue[key];

                return <Td key={key}>{propertyValue}</Td>;
              })}
              <Td key="button">
                <ArrayButtonGroup index={itemIndex} value={value} onChange={onChange} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};
