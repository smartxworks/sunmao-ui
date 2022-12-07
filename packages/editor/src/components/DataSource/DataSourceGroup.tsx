import React from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import {
  Text,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tag,
  HStack,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { ComponentNode } from '../StructureTree/ComponentNode';

interface Props {
  dataSources: ComponentSchema[];
  title: string;
  services: EditorServices;
  type: string;
}

const COLOR_MAP = {
  GET: 'green',
  POST: 'orange',
  PUT: 'yellow',
  PATCH: 'yellow',
  DELETE: 'red',
};
const STATE_MAP: Record<string, string> = {
  undefined: 'Any',
  boolean: 'Boolean',
  string: 'String',
  number: 'Number',
  object: 'Object',
};

export const DataSourceGroup: React.FC<Props> = props => {
  const { dataSources = [], title, services, type } = props;
  const { stateManager, editorStore } = services;
  const { store } = stateManager;

  const StateItems = () => (
    <>
      {dataSources.map(dataSource => {
        let tag = '';

        const trait = dataSource.traits.find(({ type }) => type === `core/v1/fetch`);
        if (trait?.properties) {
          tag = ((trait.properties.config as any).method as string).toUpperCase();
        } else {
          tag = Array.isArray(store[dataSource.id]?.value)
            ? 'Array'
            : STATE_MAP[typeof store[dataSource.id]?.value] ?? 'Any';
        }

        return (
          <ComponentNode
            id={dataSource.id}
            key={dataSource.id}
            component={dataSource}
            parentId={null}
            slot={null}
            onSelectComponent={editorStore.setSelectedComponentId}
            services={services}
            droppable={false}
            depth={0}
            isSelected={editorStore.selectedComponent?.id === dataSource.id}
            isExpanded={false}
            onToggleExpand={() => undefined}
            shouldShowSelfSlotName={false}
            notEmptySlots={[]}
            onDragStart={() => undefined}
            onDragEnd={() => undefined}
            prefix={
              tag ? (
                <Tag
                  size="sm"
                  colorScheme={COLOR_MAP[tag as keyof typeof COLOR_MAP]}
                  marginLeft="-3"
                  marginRight="1"
                >
                  {tag}
                </Tag>
              ) : undefined
            }
          />
        );
      })}
    </>
  );

  return (
    <AccordionItem>
      <AccordionButton justifyContent="space-between">
        <HStack>
          {type === 'component' ? <Tag colorScheme="blue">C</Tag> : undefined}
          <Text fontWeight="bold">{title}</Text>
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel padding="0">
        {dataSources.length ? <StateItems /> : <Text padding="2">Empty</Text>}
      </AccordionPanel>
    </AccordionItem>
  );
};
