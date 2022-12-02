import React, { useState, useMemo, useEffect } from 'react';
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
import { EditorServices } from '../../types';
import { ComponentSchema } from '@sunmao-ui/core';
import { watch } from '@sunmao-ui/runtime';
import { ComponentNode } from '../StructureTree/ComponentNode';

interface Props {
  datas: ComponentSchema[];
  title: string;
  filterPlaceholder: string;
  emptyPlaceholder: string;
  services: EditorServices;
}

const STATE_MAP: Record<string, string> = {
  undefined: 'Any',
  boolean: 'Boolean',
  string: 'String',
  number: 'Number',
  object: 'Object',
};

export const Data: React.FC<Props> = props => {
  const { datas = [], filterPlaceholder, emptyPlaceholder, title, services } = props;
  const { stateManager, editorStore } = services;
  const { store } = stateManager;
  const [search, setSearch] = useState('');
  const [reactiveStore, setReactiveStore] = useState<Record<string, any>>({ ...store });
  const list = useMemo(
    () => datas.filter(({ id }) => id.includes(search)),
    [search, datas]
  );

  useEffect(() => {
    const stop = watch(store, newValue => {
      setReactiveStore({ ...newValue });
    });

    return stop;
  }, [store]);

  const StateItems = () => (
    <>
      {list.map(state => {
        const tag = Array.isArray(reactiveStore[state.id]?.value)
          ? 'Array'
          : STATE_MAP[typeof reactiveStore[state.id]?.value] ?? 'Any';
        return (
          <ComponentNode
            id={state.id}
            key={state.id}
            component={state}
            parentId={null}
            slot={null}
            onSelectComponent={editorStore.setSelectedComponentId}
            services={services}
            droppable={false}
            depth={0}
            isSelected={editorStore.selectedComponent?.id === state.id}
            isExpanded={false}
            onToggleExpand={() => undefined}
            shouldShowSelfSlotName={false}
            hasChildrenSlots={[]}
            onDragStart={() => undefined}
            onDragEnd={() => undefined}
            prefix={
              <Tag size="xs" colorScheme={tag} marginLeft="-3" marginRight="1">
                {tag}
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
