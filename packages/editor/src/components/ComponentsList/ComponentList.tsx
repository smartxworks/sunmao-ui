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
  InputGroup,
  InputRightElement,
  Tag,
} from '@chakra-ui/react';
import { CoreComponentName, CORE_VERSION } from '@sunmao-ui/shared';
import { groupBy, sortBy } from 'lodash';
import { EditorServices } from '../../types';
import { ExplorerMenuTabs } from '../../constants/enum';
import { RuntimeComponent } from '@sunmao-ui/core';
import { css } from '@emotion/css';
import { ComponentFilter } from './ComponentFilter';

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
  } else if (version.startsWith(CORE_VERSION)) {
    return 'yellow';
  } else {
    return 'blackAlpha';
  }
}

const tagStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const IGNORE_COMPONENTS: string[] = [CoreComponentName.Dummy];

export const ComponentList: React.FC<Props> = ({ services }) => {
  const { registry, editorStore } = services;
  const [filterText, setFilterText] = useState('');
  const [checkedVersions, setCheckedVersions] = useState<string[]>([]);

  const versions = useMemo<string[]>(() => {
    const versions: Record<string, string> = {};
    registry.getAllComponents().forEach(c => {
      versions[c.version] = '';
    });
    return Object.keys(versions);
  }, [registry]);

  const categories = useMemo<Category[]>(() => {
    const grouped = groupBy(
      registry.getAllComponents().filter(c => {
        if (
          IGNORE_COMPONENTS.includes(c.metadata.name) ||
          (checkedVersions.length && !checkedVersions.includes(c.version))
        ) {
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
  }, [filterText, registry, checkedVersions]);

  return (
    <>
      <InputGroup>
        <Input
          placeholder="filter the components"
          value={filterText}
          onChange={evt => setFilterText(evt.currentTarget.value)}
        />
        <InputRightElement>
          <ComponentFilter
            versions={versions}
            checkedVersions={checkedVersions}
            setCheckedVersions={setCheckedVersions}
          />
        </InputRightElement>
      </InputGroup>
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
                        <div className={tagStyle}>{c.version}</div>
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
