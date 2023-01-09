import React, { useEffect, useState } from 'react';
import {
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Input,
  Text,
} from '@chakra-ui/react';
import { OutsideExpRelation, OutsideExpRelationWithState } from './type';
import { Placeholder } from './Placeholder';
import produce from 'immer';

type Props = {
  outsideExpRelations: OutsideExpRelation[];
  onChange: (value: OutsideExpRelationWithState[]) => void;
};

export const ExtractModuleStateForm: React.FC<Props> = ({
  outsideExpRelations,
  onChange,
}) => {
  const [value, setValue] = useState<OutsideExpRelationWithState[]>([]);

  useEffect(() => {
    const newValue = outsideExpRelations.map(r => {
      return {
        ...r,
        stateName: `${r.relyOn}${r.valuePath}`,
      };
    });
    setValue(newValue);
  }, [outsideExpRelations]);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  let content = (
    <Placeholder text={`No outside component uses in-module components' state.`} />
  );
  if (outsideExpRelations.length) {
    content = (
      <Table
        size="sm"
        border="1px solid"
        borderColor="gray.100"
        style={{
          tableLayout: 'fixed',
        }}
      >
        <Thead>
          <Tr>
            <Th>Component</Th>
            <Th>Key</Th>
            <Th>Expression</Th>
            <Th>RawExp</Th>
            <Th>StateName</Th>
          </Tr>
        </Thead>
        <Tbody>
          {value.map((d, i) => {
            const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = produce(value, draft => {
                draft[i].stateName = e.target.value;
                return draft;
              });
              setValue(newValue);
            };
            return (
              <Tr key={i}>
                <Td>
                  <Text color="blue.500">{d.componentId}</Text>
                </Td>
                <Td>{d.key}</Td>
                <Td>{d.exp}</Td>
                <Td>{`${d.relyOn}.${d.valuePath}`}</Td>
                <Td>
                  <Input size="sm" value={d.stateName} onChange={onChange} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }

  return (
    <VStack width="full" alignItems="start">
      <Heading size="md">Module State</Heading>
      <Text>
        {`These outside components used in-module components' state.
        You have to give these expression a new name which will become the state exposed by module.`}
      </Text>
      {content}
    </VStack>
  );
};
