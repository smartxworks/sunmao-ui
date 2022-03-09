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
import { ComponentSchema } from '@sunmao-ui/core';

interface Props {
  states: ComponentSchema[];
  active: string;
  title: string;
  traitType: string;
  filterPlaceholder: string;
  emptyPlaceholder: string;
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

export const State: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const {
    states,
    active,
    onItemClick,
    onItemRemove,
    filterPlaceholder,
    emptyPlaceholder,
    title,
    traitType,
  } = props;
  const list = useMemo(
    () => states.filter(({ id }) => id.includes(search)),
    [search, states]
  );

  const StateItems = () => (
    <>
      {list.map(state => {
        const trait = state.traits.find(({ type }) => type === traitType);
        const properties = trait!.properties;

        return (
          <DataSourceItem
            key={state.id}
            dataSource={state}
            tag={
              Array.isArray(properties.initialValue)
                ? 'Array'
                : STATE_MAP[typeof properties.initialValue] ?? 'Any'
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
