import React from 'react';
import SchemaField from './SchemaField';
import { FieldProps } from './fields';
import { Box, ButtonGroup, IconButton, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { parseTypeBox } from '@meta-ui/runtime';
import { TSchema } from '@sinclair/typebox';

type Props = FieldProps;

function swap<T>(arr: Array<T>, i1: number, i2: number): Array<T> {
  const tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
  return arr;
}

const ArrayField: React.FC<Props> = props => {
  const { schema, formData, onChange } = props;
  const subSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
  if (typeof subSchema === 'boolean' || !subSchema) {
    return null;
  }
  if (!Array.isArray(formData)) {
    return (
      <div>
        Expected array but got
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    );
  }
  return (
    <>
      {formData.map((v, idx) => {
        return (
          <Box key={idx} mb={2}>
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
                  const newFormData = [...formData];
                  swap(newFormData, idx, idx - 1);
                  onChange(newFormData);
                }}
              />
              <IconButton
                aria-label={`down-${idx}`}
                icon={<ArrowDownIcon />}
                disabled={idx === formData.length - 1}
                onClick={() => {
                  const newFormData = [...formData];
                  swap(newFormData, idx, idx + 1);
                  onChange(newFormData);
                }}
              />
              <IconButton
                aria-label={`delete-${idx}`}
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => {
                  const newFormData = [...formData];
                  newFormData.splice(idx, 1);
                  onChange(newFormData);
                }}
              />
            </ButtonGroup>
            <SchemaField
              schema={subSchema}
              label={subSchema.title || ''}
              formData={v}
              onChange={value => {
                const newFormData = [...formData];
                newFormData[idx] = value;
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
            onChange(formData.concat(parseTypeBox(subSchema as TSchema)));
          }}
        />
      </Flex>
    </>
  );
};

export default ArrayField;
