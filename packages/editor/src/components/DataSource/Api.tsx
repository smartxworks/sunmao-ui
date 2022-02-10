import React from 'react';
import {
  Box,
  Text,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { DataSourceItem } from './DataSourceItem';

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
  const { apis, active, onItemClick, onItemRemove } = props;
  const ApiItems = () => (
    <>
      {apis.map(api => {
        const trait = api.traits.find(({ type }) => type === 'core/v1/fetch');
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
        {apis.length ? <ApiItems /> : <Text padding="2">No Apis.</Text>}
      </AccordionPanel>
    </AccordionItem>
  );
};
