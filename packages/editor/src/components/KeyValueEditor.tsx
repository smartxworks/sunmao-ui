import { CloseIcon } from '@chakra-ui/icons';
import { Button, HStack, IconButton, Input, VStack } from '@chakra-ui/react';
import produce from 'immer';
import { fromPairs, toPairs } from 'lodash-es';
import React, { useState } from 'react';

type Props = {
  onChange: (json: Record<string, string>) => void;
  initValue?: Record<string, string>;
};

export const KeyValueEditor: React.FC<Props> = props => {
  const [rows, setRows] = useState<Array<[string, string]>>(() => {
    return toPairs(props.initValue);
  });

  const emitDataChange = (newRows: Array<[string, string]>) => {
    const json = fromPairs(newRows);
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
      <HStack key={i} spacing="1">
        <Input
          name="key"
          value={key}
          placeholder="key"
          size="sm"
          onChange={onInputChange}
          onBlur={onBlur}
        />
        <Input
          name="value"
          value={value}
          placeholder="value"
          size="sm"
          onChange={onInputChange}
          onBlur={onBlur}
        />
        <IconButton
          aria-label="remove row"
          icon={<CloseIcon />}
          size="xs"
          onClick={() => onRemoveRow(i)}
          variant="ghost"
        />
      </HStack>
    );
  });

  return (
    <VStack spacing="1" alignItems="start">
      {rowItems}
      <Button onClick={onAddRow} size="xs">
        + Add
      </Button>
    </VStack>
  );
};
