import React, { useEffect, useState } from 'react';
import { Input, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { OutsideExpRelation, OutsideExpRelationWithState } from './type';
import produce from 'immer';

type Props = {
  outsideExpRelations: OutsideExpRelation[];
  onChange: (value: OutsideExpRelationWithState[]) => void;
};
export const RenameStateForm: React.FC<Props> = ({ outsideExpRelations, onChange }) => {
  const [value, setValue] = useState<OutsideExpRelationWithState[]>([]);

  useEffect(() => {
    const newValue = outsideExpRelations.map(r => {
      return {
        ...r,
        stateName: '',
      };
    });
    setValue(newValue);
  }, [outsideExpRelations]);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <Table size="sm" border="1px solid" borderColor="gray.100">
      <Thead>
        <Tr>
          <Th>Comoonent</Th>
          <Th>key</Th>
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
              <Td>{d.componentId}</Td>
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
};
