import React, { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Input,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tag,
} from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';
import { EditorServices } from '../../types';
import { ComponentNode } from '../StructureTree/ComponentNode';

const COLOR_MAP = {
  GET: 'green',
  POST: 'orange',
  PUT: 'yellow',
  PATCH: 'yellow',
  DELETE: 'red',
};

interface Props {
  apis: ComponentSchema[];
  services: EditorServices;
}

export const Api: React.FC<Props> = props => {
  const { apis, services } = props;
  const { editorStore } = services;
  const [search, setSearch] = useState('');
  const list = useMemo(
    () => apis.filter(({ id }) => id.includes(search)),
    [search, apis]
  );
  const ApiItems = () => (
    <>
      {list.map(api => {
        const trait = api.traits.find(
          ({ type }) => type === `${CORE_VERSION}/${CoreTraitName.Fetch}`
        );
        const properties = trait!.properties;
        const method = (
          properties.method as string
        ).toUpperCase() as keyof typeof COLOR_MAP;

        return (
          <ComponentNode
            id={api.id}
            key={api.id}
            component={api}
            parentId={null}
            slot={null}
            onSelectComponent={editorStore.setSelectedComponentId}
            services={services}
            droppable={false}
            depth={0}
            isSelected={editorStore.selectedComponent?.id === api.id}
            isExpanded={false}
            onToggleExpand={() => undefined}
            shouldShowSelfSlotName={false}
            hasChildrenSlots={[]}
            onDragStart={() => undefined}
            onDragEnd={() => undefined}
            prefix={
              <Tag
                size="sm"
                colorScheme={COLOR_MAP[method]}
                marginLeft="-3"
                marginRight="1"
              >
                {method}
              </Tag>
            }
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
