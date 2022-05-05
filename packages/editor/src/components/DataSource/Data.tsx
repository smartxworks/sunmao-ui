import React, { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Input,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { DataSourceItem } from './DataSourceItem';
import { EditorServices } from '../../types';
import { ComponentSchema } from '@sunmao-ui/core';

interface Props {
  datas: ComponentSchema[];
  active: string;
  title: string;
  traitType: string;
  filterPlaceholder: string;
  emptyPlaceholder: string;
  services: EditorServices;
  onItemClick: (state: ComponentSchema) => void;
  onItemRemove: (state: ComponentSchema) => void;
}

const STATE_MAP: Record<string, string> = {
  undefined: 'Any',
  boolean: 'Boolean',
  string: 'String',
  number: 'Number',
  object: 'Object',
};

export const Data: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const {
    datas = [],
    active,
    onItemClick,
    onItemRemove,
    filterPlaceholder,
    emptyPlaceholder,
    title,
    services,
  } = props;
  const { stateManager } = services;
  const { store } = stateManager;
  const list = useMemo(
    () => datas.filter(({ id }) => id.includes(search)),
    [search, datas]
  );
  
  const StateItems = () => (
    <>
      {list.map(state => {
        return (
          <DataSourceItem
            key={state.id}
            dataSource={state}
            tag={
              Array.isArray(store[state.id]?.value)
                ? 'Array'
                : STATE_MAP[typeof store[state.id]?.value] ?? 'Any'
            }
            name={state.id}
            active={active === state.id}
            onItemClick={onItemClick}
            onItemRemove={onItemRemove}
          />
        );
      })}
    </>
  );

  return (
    <AccordionItem>
      <h2>
        <AccordionButton borderBottom="solid" borderColor="inherit">
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb="4" padding="0">
        <Input
          placeholder={filterPlaceholder}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        {list.length ? <StateItems /> : <Text padding="2">{emptyPlaceholder}</Text>}
      </AccordionPanel>
    </AccordionItem>
  );
};
