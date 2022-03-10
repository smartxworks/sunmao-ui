import React from 'react';
import { ButtonGroup, IconButton } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';

export type ArrayButtonGroupProps = {
  index: number;
  value: any[];
  onChange: (value: any[]) => void;
};

function swap<T>(arr: Array<T>, i1: number, i2: number): Array<T> {
  const tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
  return arr;
}

export const ArrayButtonGroup: React.FC<ArrayButtonGroupProps> = props => {
  const { index, value, onChange } = props;

  return (
    <ButtonGroup
      spacing={0}
      size="xs"
      variant="ghost"
      display="flex"
      justifyContent="end"
    >
      <IconButton
        aria-label={`up-${index}`}
        icon={<ArrowUpIcon />}
        disabled={index === 0}
        onClick={() => {
          const newFormData = [...value];
          swap(newFormData, index, index - 1);
          onChange(newFormData);
        }}
      />
      <IconButton
        aria-label={`down-${index}`}
        icon={<ArrowDownIcon />}
        disabled={index === value.length - 1}
        onClick={() => {
          const newFormData = [...value];
          swap(newFormData, index, index + 1);
          onChange(newFormData);
        }}
      />
      <IconButton
        aria-label={`delete-${index}`}
        icon={<DeleteIcon />}
        colorScheme="red"
        onClick={() => {
          const newFormData = [...value];
          newFormData.splice(index, 1);
          onChange(newFormData);
        }}
      />
    </ButtonGroup>
  );
};
