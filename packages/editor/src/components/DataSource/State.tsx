import React from 'react';
import {
  Box,
  Text,
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
  const { states, active, onItemClick, onItemRemove } = props;

  const StateItems = () => (
    <>
      {states.map(state => {
        const trait = state.traits.find(({ type }) => type === 'core/v1/state');
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
            State
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb="4" padding="0">
        {states.length ? <StateItems /> : <Text padding="2">No States.</Text>}
      </AccordionPanel>
    </AccordionItem>
  );
};
