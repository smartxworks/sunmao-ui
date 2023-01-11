import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Text,
  HStack,
  IconButton,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import produce from 'immer';
import { fromPairs, toPairs } from 'lodash';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Type } from '@sinclair/typebox';
import { SpecWidget } from '../Widgets/SpecWidget';
import { ExpressionWidget } from '../Widgets/ExpressionWidget';
import { ExpressionEditor } from '../Form/ExpressionEditor';
import { WidgetProps } from '../../types/widget';
import { mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { ExpressionEditorProps } from './ExpressionEditor';
import { generateDefaultValueFromSpec } from '@sunmao-ui/shared';
import { JSONSchema7 } from 'json-schema';
import { css } from '@emotion/css';

const IGNORE_SPEC_TYPES = ['array', 'object'];

type RecordFieldProps = WidgetProps<'core/v1/record'>;

type RecordEditorProps = Omit<
  RecordFieldProps,
  'component' | 'spec' | 'level' | 'path'
> & {
  component?: RecordFieldProps['component'];
  spec?: RecordFieldProps['spec'];
  path?: RecordFieldProps['path'];
  level?: RecordFieldProps['level'];
};
type RowItemProps = RecordEditorProps & {
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
    spec,
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
  const { stateManager } = services;
  const { minNum = 0, onlySetValue } = useMemo(() => spec?.widgetOptions || {}, [spec]);
  const expressionOptions = useMemo<{
    compactOptions: ExpressionEditorProps['compactOptions'];
  }>(
    () => ({
      compactOptions: {
        maxHeight: '125px',
      },
    }),
    []
  );
  const valueSpec = useMemo(
    () => (onlySetValue ? spec?.properties?.[rowKey] : spec?.patternProperties?.['^.*$']),
    [spec, rowKey, onlySetValue]
  );
  const valueSpecWithExpressionOptions = useMemo(
    () =>
      valueSpec && typeof valueSpec !== 'boolean'
        ? mergeWidgetOptionsIntoSpec<'core/v1/expression'>(valueSpec, {
            compactOptions: expressionOptions.compactOptions,
          })
        : Type.Any({
            widget: 'core/v1/expression',
            widgetOptions: {
              compactOptions: expressionOptions.compactOptions,
            },
          }),
    [valueSpec, expressionOptions]
  );
  const valueSpecWithOptions = useMemo(
    () =>
      valueSpec && typeof valueSpec !== 'boolean'
        ? mergeWidgetOptionsIntoSpec<'core/v1/spec'>(valueSpec, {
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
    <HStack spacing="1" display="flex" alignItems="stretch">
      <Textarea
        className={css`
          &&&:focus {
            background: var(--chakra-colors-gray-100);
          }
        `}
        resize="none"
        rows={1}
        paddingTop="6px"
        paddingBottom="6px"
        minWidth={0}
        border="none"
        height="auto"
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
          (IGNORE_SPEC_TYPES.includes(String(valueSpec.type)) &&
            valueSpecWithExpressionOptions?.widget === undefined) ? (
              <ExpressionWidget
                component={component}
                path={nextPath}
                spec={valueSpecWithExpressionOptions}
                services={services}
                level={level + 1}
                value={value}
                onChange={onValueChange}
            />
          ) : (
            <SpecWidget
              component={component}
              value={value}
              path={nextPath}
              level={level + 1}
              spec={valueSpecWithOptions}
              services={services}
              onChange={onValueChange}
            />
          )}
        </HStack>
      ) : (
        (() => {
          const evaledResult = stateManager.deepEval(value);

          return (
            <Box flex="2 2 66.66%" minWidth={0}>
              <ExpressionEditor
                compactOptions={{
                  maxHeight: '125px',
                }}
                defaultCode={value}
                evaledValue={evaledResult}
                error={evaledResult instanceof Error ? evaledResult.message : undefined}
                onChange={onValueChange}
                onBlur={onBlur}
              />
            </Box>
          );
        })()
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

export const RecordEditor: React.FC<RecordEditorProps> = props => {
  const { value, spec, onChange } = props;
  const { minNum = 0, onlySetValue, isShowHeader } = spec?.widgetOptions || {};
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
    const propSpec = spec?.patternProperties?.['^.*$'];

    setRows(prev => [
      ...prev,
      ['', propSpec ? generateDefaultValueFromSpec(propSpec as JSONSchema7) : ''],
    ]);
  }, [spec]);
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
