import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Text, HStack, IconButton, Input, VStack } from '@chakra-ui/react';
import produce from 'immer';
import { fromPairs, toPairs } from 'lodash-es';
import React, { useState, useMemo, useEffect } from 'react';
import SchemaField from './ComponentForm/JsonSchemaForm/SchemaField';
import { ExpressionWidget } from './ComponentForm/JsonSchemaForm/widgets/ExpressionWidget';
import { FieldProps } from './ComponentForm/JsonSchemaForm/fields';
import { ExpressionEditorProps } from './CodeEditor/ExpressionEditor';

type Props = {
  schema?: FieldProps['schema'];
  registry: FieldProps['registry'];
  stateManager: FieldProps['stateManager'];
  onChange: (json: Record<string, string>) => void;
  value?: Record<string, string>;
  isShowHeader?: boolean;
  minNum?: number;
  onlySetValue?: boolean;
};

const IGNORE_SCHEMA_TYPES = ['array', 'object'];

export const KeyValueEditor: React.FC<Props> = props => {
  const { schema, minNum = 0, registry, stateManager, onlySetValue } = props;
  const generateRows = (currentRows: Array<[string, string]> = []) => {
    let newRows = toPairs(props.value);

    // keep the rows which has no key
    newRows = newRows.concat(currentRows.filter(([key]) => !key));

    return newRows.length < minNum
      ? newRows.concat(new Array(minNum - newRows.length).fill(['', '']))
      : newRows;
  };
  const [rows, setRows] = useState<Array<[string, string]>>(() => {
    return generateRows();
  });
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

  const emitDataChange = (newRows: Array<[string, string]>) => {
    const json = fromPairs(newRows.filter(([key]) => key));
    props.onChange(json);
  };

  const onAddRow = () => {
    setRows(prev => [...prev, ['', '']]);
  };
  const onRemoveRow = (i: number) => {
    const newRows = produce(rows, draft => {
      draft.splice(i, 1);
    });
    setRows(newRows);
    emitDataChange(newRows);
  };
  
  useEffect(() => {
    setRows(generateRows(rows));
  }, [props.value]);

  const rowItems = rows.map(([key, value], i) => {
    const onInputChange = (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      const index = target.name === 'key' ? 0 : 1;
      const newRows = produce(rows, draft => {
        draft[i][index] = target.value;
      });
      setRows(newRows);
    };
    const onValueChange = (newValue: any) => {
      const newRows = produce(rows, draft => {
        draft[i][1] = newValue;
      });
      setRows(newRows);
      emitDataChange(newRows);
    };
    const onBlur = () => emitDataChange(rows);
    const keySchemaType =
      schema?.properties && key in schema.properties && schema.properties[key];

    return (
      <HStack key={i} spacing="1" display="flex">
        <Input
          flex={1}
          name="key"
          value={key}
          title={key}
          placeholder="key"
          onChange={onInputChange}
          onBlur={onBlur}
          isDisabled={onlySetValue}
        />
        <HStack flex={2} alignItems="center">
          {keySchemaType &&
          typeof keySchemaType !== 'boolean' &&
          !IGNORE_SCHEMA_TYPES.includes(String(keySchemaType.type)) ? (
            <SchemaField
              label=""
              formData={value}
              schema={keySchemaType}
              registry={registry}
              stateManager={stateManager}
              expressionOptions={expressionOptions}
              onChange={onValueChange}
            />
          ) : (
            <Box flex={1}>
              <ExpressionWidget
                formData={value}
                stateManager={stateManager}
                compactOptions={expressionOptions.compactOptions}
                onChange={onValueChange}
              />
            </Box>
          )}
        </HStack>
        {onlySetValue ? null : (
          <IconButton
            aria-label="remove row"
            icon={<CloseIcon />}
            size="xs"
            onClick={() => onRemoveRow(i)}
            variant="ghost"
            isDisabled={minNum >= rows.length}
          />
        )}
      </HStack>
    );
  });

  return (
    <VStack spacing="2" alignItems="stretch">
      {props.isShowHeader ? (
        <HStack spacing="1" display="flex" marginRight="28px">
          <Text flex={1}>Key</Text>
          <Text flex={1}>Value</Text>
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
