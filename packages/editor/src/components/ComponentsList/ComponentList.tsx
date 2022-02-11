import React, { useMemo, useState } from 'react';
import {
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Input,
  Tag,
} from '@chakra-ui/react';
import { encodeDragDataTransfer, DROP_EXAMPLE_SIZE_PREFIX } from '@sunmao-ui/runtime';
import { groupBy, sortBy } from 'lodash-es';
import { EditorServices } from '../../types';
import { ExplorerMenuTabs } from '../../services/enum';
import { RuntimeComponent } from '@sunmao-ui/core';

type Props = {
  services: EditorServices;
};

type Category = {
  name: string;
  components: RuntimeComponent<string, string, string, string>[];
};

const PRESET_CATEGORY_ORDER = {
  Layout: 5,
  Input: 4,
  Display: 3,
  Advance: -Infinity,
};

function getCategoryOrder(name: string): number {
  return name in PRESET_CATEGORY_ORDER
    ? PRESET_CATEGORY_ORDER[name as keyof typeof PRESET_CATEGORY_ORDER]
    : 0;
}

function getTagColor(version: string): string {
  if (version.startsWith('chakra_ui/')) {
    return 'teal';
  } else if (version.startsWith('core/v1')) {
    return 'yellow';
  } else {
    return 'blackAlpha';
  }
}

const IGNORE_COMPONENTS = ['dummy'];

export const ComponentList: React.FC<Props> = ({ services }) => {
  const { registry, editorStore } = services;
  const [filterText, setFilterText] = useState('');
  const categories = useMemo<Category[]>(() => {
    const grouped = groupBy(
      registry.getAllComponents().filter(c => {
        if (IGNORE_COMPONENTS.includes(c.metadata.name)) {
          return false;
        } else if (!filterText) {
          return true;
        }
        return new RegExp(filterText, 'i').test(c.metadata.displayName);
      }),
      c => c.metadata.annotations?.category || 'Advance'
    );
    return sortBy(
      Object.keys(grouped).map(name => ({
        name,
        components: sortBy(grouped[name], 'metadata.name'),
      })),
      c => -getCategoryOrder(c.name)
    );
  }, [filterText, registry]);

  return (
    <>
      <Input
        placeholder="filter the components"
        value={filterText}
        onChange={evt => setFilterText(evt.currentTarget.value)}
      />
      <Accordion allowMultiple defaultIndex={categories.map((_, idx) => idx)}>
        {categories.map(category => {
          return (
            <AccordionItem key={category.name}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {category.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {category.components.map(c => {
                  const onDragStart = (e: any) => {
                    e.dataTransfer.setData(
                      'component',
                      `${c.version}/${c.metadata.name}`
                    );
                    // pass the exampleSize to gridlayout to render placeholder
                    e.dataTransfer.setData(
                      encodeDragDataTransfer(
                        `${DROP_EXAMPLE_SIZE_PREFIX}${JSON.stringify(
                          c.metadata.exampleSize
                        )}`
                      ),
                      ''
                    );

                    editorStore.setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
                    editorStore.setIsDraggingNewComponent(true);
                  };
                  const onDragEnd = () => {
                    editorStore.setIsDraggingNewComponent(false);
                  };
                  const cEle = (
                    <Flex
                      key={`${c.version}/${c.metadata.name}`}
                      className="droppable-element"
                      cursor="move"
                      background="gray.100"
                      width="100%"
                      borderRadius="md"
                      align="center"
                      justify="space-between"
                      transition="ease 0.2s"
                      _hover={{
                        transform: 'scale(1.05)',
                        background: 'gray.200',
                      }}
                      p={2}
                      mb={1}
                      draggable
                      unselectable="on"
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    >
                      {c.metadata.displayName}
                      <Tag colorScheme={getTagColor(c.version)} size="sm">
                        {c.version}
                      </Tag>
                    </Flex>
                  );
                  return cEle;
                })}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};
