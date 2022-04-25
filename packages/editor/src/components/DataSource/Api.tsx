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
import { ComponentSchema } from '@sunmao-ui/core';
import { DataSourceItem } from './DataSourceItem';
import { CORE_VERSION, FETCH_TRAIT_NAME } from '@sunmao-ui/shared';

const COLOR_MAP = {
  GET: 'green',
  POST: 'orange',
  PUT: 'yellow',
  PATCH: 'yellow',
  DELETE: 'red',
};

interface Props {
  apis: ComponentSchema[];
  active: string;
  onItemClick: (api: ComponentSchema) => void;
  onItemRemove: (api: ComponentSchema) => void;
}

export const Api: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const { apis, active, onItemClick, onItemRemove } = props;
  const list = useMemo(
    () => apis.filter(({ id }) => id.includes(search)),
    [search, apis]
  );
  const ApiItems = () => (
    <>
      {list.map(api => {
        const trait = api.traits.find(({ type }) => type === `${CORE_VERSION}/${FETCH_TRAIT_NAME}`);
        const properties = trait!.properties;
        const method = (
          properties.method as string
        ).toUpperCase() as keyof typeof COLOR_MAP;

        return (
          <DataSourceItem
            key={api.id}
            dataSource={api}
            tag={method}
            name={api.id}
            active={active === api.id}
            colorMap={COLOR_MAP}
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
            API
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb="4" padding="0">
        <Input
          placeholder="filter the apis"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        {list.length ? <ApiItems /> : <Text padding="2">No APIs.</Text>}
      </AccordionPanel>
    </AccordionItem>
  );
};
