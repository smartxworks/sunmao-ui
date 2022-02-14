import { CloseIcon } from '@chakra-ui/icons';
import { Button, Text, HStack, IconButton, Input, VStack } from '@chakra-ui/react';
import produce from 'immer';
import { fromPairs, toPairs } from 'lodash-es';
import React, { useState, useEffect } from 'react';

type Props = {
  onChange: (json: Record<string, string>) => void;
  value?: Record<string, string>;
  isShowHeader?: boolean;
  minNum?: number;
  onlySetValue?: boolean;
};

export const KeyValueEditor: React.FC<Props> = props => {
  const { minNum = 0, onlySetValue } = props;
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

  useEffect(() => {
    setRows(generateRows(rows));
  }, [props.value]);

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

  const rowItems = rows.map(([key, value], i) => {
    const onInputChange = (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      const index = target.name === 'key' ? 0 : 1;
      const newRows = produce(rows, draft => {
        draft[i][index] = target.value;
      });
      setRows(newRows);
    };
    const onBlur = () => emitDataChange(rows);
    return (
      <HStack key={i} spacing="1" display="flex">
        <Input
          flex={1}
          name="key"
          value={key}
          placeholder="key"
          onChange={onInputChange}
          onBlur={onBlur}
          isDisabled={onlySetValue}
        />
        <Input
          flex={1}
          name="value"
          value={value}
          placeholder="value"
          onChange={onInputChange}
          onBlur={onBlur}
        />
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
