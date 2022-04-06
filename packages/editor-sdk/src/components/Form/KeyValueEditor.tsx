import { CloseIcon } from '@chakra-ui/icons';
import { Button, Text, HStack, IconButton, Input, VStack } from '@chakra-ui/react';
import produce from 'immer';
import { fromPairs, toPairs } from 'lodash-es';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Type } from '@sinclair/typebox';
import { SchemaField } from '../Widgets/SchemaField';
import { ExpressionWidget } from '../Widgets/ExpressionWidget';
import { WidgetProps } from '../../types/widget';
import { mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import { ExpressionEditorProps } from './ExpressionEditor';

const IGNORE_SCHEMA_TYPES = ['array', 'object'];

type KeyValueEditorProps = Omit<
  WidgetProps,
  'component' | 'schema' | 'level' | 'path'
> & {
  component?: WidgetProps['component'];
  schema?: WidgetProps['schema'];
  path?: WidgetProps['path'];
  level?: WidgetProps['level'];
};
type RowItemProps = KeyValueEditorProps & {
  index: number;
  rowKey: string;
  rows: Array<[string, any]>;
  setRows: (rows: Array<[string, any]>) => void;
  onRemoveRow: (index: number) => void;
  emitDataChange: (rows: Array<[string, any]>) => void;
};

const RowItem = (props: RowItemProps) => {
  const {
    rows,
    index: i,
    schema,
    rowKey,
    component,
    value,
    path = [],
    level = 1,
    services,
    setRows,
    onRemoveRow,
    emitDataChange,
  } = props;
  const { minNum = 0, onlySetValue } = useMemo(
    () => schema?.widgetOptions || {},
    [schema]
  );
  const expressionOptions = useMemo<{
    compactOptions: ExpressionEditorProps['compactOptions'];
  }>(
    () => ({
      compactOptions: {
        height: '32px',
      },
    }),
    []
  );
  const valueSpec = useMemo(() => schema?.properties?.[rowKey], [schema, rowKey]);
  const valueSpecWithExpressionOptions = useMemo(
    () =>
      valueSpec && typeof valueSpec !== 'boolean'
        ? {
            ...valueSpec,
            widgetOptions: {
              compactOptions: expressionOptions.compactOptions,
            },
          }
        : Type.Any({
            widgetOptions: {
              compactOptions: expressionOptions.compactOptions,
            },
          }),
    [valueSpec, expressionOptions]
  );
  const valueSpecWithOptions = useMemo(
    () =>
      valueSpec && typeof valueSpec !== 'boolean'
        ? mergeWidgetOptionsIntoSchema(valueSpec, {
            isShowAsideExpressionButton: true,
            expressionOptions,
          })
        : Type.Any(),
    [valueSpec, expressionOptions]
  );
  const nextPath = useMemo(() => path.concat(rowKey), [path, rowKey]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      const index = target.name === 'key' ? 0 : 1;
      const newRows = produce(rows, draft => {
        draft[i][index] = target.value;
      });
      setRows(newRows);
    },
    [rows, setRows, i]
  );
  const onValueChange = useCallback(
    (newValue: any) => {
      const newRows = produce(rows, draft => {
        draft[i][1] = newValue;
      });
      setRows(newRows);
      emitDataChange(newRows);
    },
    [rows, i, setRows, emitDataChange]
  );
  const onBlur = useCallback(() => emitDataChange(rows), [rows, emitDataChange]);
  const onRemove = useCallback(() => onRemoveRow(i), [i, onRemoveRow]);

  return (
    <HStack spacing="1" display="flex">
      <Input
        minWidth={0}
        flex="1 1 33.33%"
        name="key"
        value={rowKey}
        title={rowKey}
        placeholder="key"
        onChange={onInputChange}
        onBlur={onBlur}
        isDisabled={onlySetValue}
      />
      {component ? (
        <HStack minWidth={0} flex="2 2 66.66%" alignItems="center">
          {valueSpec === undefined ||
          typeof valueSpec === 'boolean' ||
          IGNORE_SCHEMA_TYPES.includes(String(valueSpec.type)) ? (
            <ExpressionWidget
              component={component}
              path={nextPath}
              schema={valueSpecWithExpressionOptions}
              services={services}
              level={level + 1}
              value={value}
              onChange={onValueChange}
            />
          ) : (
            <SchemaField
              component={component}
              value={value}
              path={nextPath}
              level={level + 1}
              schema={valueSpecWithOptions}
              services={services}
              onChange={onValueChange}
            />
          )}
        </HStack>
      ) : (
        <Input
          flex={2}
          minWidth={0}
          name="value"
          value={value}
          title={value}
          placeholder="value"
          onChange={onInputChange}
          onBlur={onBlur}
        />
      )}
      {onlySetValue ? null : (
        <IconButton
          aria-label="remove row"
          icon={<CloseIcon />}
          size="xs"
          onClick={onRemove}
          variant="ghost"
          isDisabled={minNum >= rows.length}
        />
      )}
    </HStack>
  );
};

export const KeyValueEditor: React.FC<KeyValueEditorProps> = props => {
  const { value, schema, onChange } = props;
  const { minNum = 0, onlySetValue, isShowHeader } = schema?.widgetOptions || {};
  const generateRows = (currentRows: Array<[string, any]> = []) => {
    let newRows = toPairs(value);

    // keep the rows which has no key
    newRows = newRows.concat(currentRows.filter(([key]) => !key));

    return newRows.length < minNum
      ? newRows.concat(new Array(minNum - newRows.length).fill(['', '']))
      : newRows;
  };
  const [rows, setRows] = useState<Array<[string, any]>>(() => {
    return generateRows();
  });

  const emitDataChange = useCallback(
    (newRows: Array<[string, string]>) => {
      const json = fromPairs(newRows.filter(([key]) => key));

      onChange(json);
    },
    [onChange]
  );

  const onAddRow = useCallback(() => {
    setRows(prev => [...prev, ['', '']]);
  }, []);
  const onRemoveRow = useCallback(
    (i: number) => {
      const newRows = produce(rows, draft => {
        draft.splice(i, 1);
      });
      setRows(newRows);
      emitDataChange(newRows);
    },
    [rows, setRows, emitDataChange]
  );

  useEffect(() => {
    setRows(generateRows(rows));
  }, [value]);

  const rowItems = rows.map(([key, value], i) => (
    <RowItem
      key={i}
      {...props}
      rows={rows}
      rowKey={key}
      value={value}
      index={i}
      setRows={setRows}
      onRemoveRow={onRemoveRow}
      emitDataChange={emitDataChange}
    />
  ));

  return (
    <VStack spacing="2" alignItems="stretch">
      {isShowHeader !== false ? (
        <HStack spacing="1" display="flex">
          <Text flex={1}>Key</Text>
          <Text flex={2}>Value</Text>
        </HStack>
      ) : null}
      {rowItems}
      {onlySetValue ? null : (
        <Button onClick={onAddRow} size="xs" alignSelf="start">
          + Add
        </Button>
      )}
    </VStack>
  );
};
