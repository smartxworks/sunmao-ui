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
  Button,
  Popover,
  Checkbox,
  PopoverContent,
  chakra,
  PopoverTrigger,
} from '@chakra-ui/react';
import { DROP_EXAMPLE_SIZE_PREFIX } from '@sunmao-ui/runtime';
import {
  encodeDragDataTransfer,
  CoreComponentName,
  CORE_VERSION,
} from '@sunmao-ui/shared';
import { groupBy, sortBy } from 'lodash-es';
import { EditorServices } from '../../types';
import { ExplorerMenuTabs } from '../../constants/enum';
import { RuntimeComponent } from '@sunmao-ui/core';
import { css } from '@emotion/css';
import { createIcon } from '@chakra-ui/icons';

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

const FilterIcon = createIcon({
  displayName: 'FilterIcon',
  viewBox: '0 0 24 24',
  path: [
    <path
      key="Stroke 1"
      id="Stroke 1"
      d="M11.1437 17.8829H4.67114"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 3"
      id="Stroke 3"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.205 17.8839C15.205 19.9257 15.8859 20.6057 17.9267 20.6057C19.9676 20.6057 20.6485 19.9257 20.6485 17.8839C20.6485 15.8421 19.9676 15.1621 17.9267 15.1621C15.8859 15.1621 15.205 15.8421 15.205 17.8839Z"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 5"
      id="Stroke 5"
      d="M14.1765 7.39439H20.6481"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 7"
      id="Stroke 7"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1153 7.39293C10.1153 5.35204 9.43436 4.67114 7.39346 4.67114C5.35167 4.67114 4.67078 5.35204 4.67078 7.39293C4.67078 9.43472 5.35167 10.1147 7.39346 10.1147C9.43436 10.1147 10.1153 9.43472 10.1153 7.39293Z"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});

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

const IGNORE_COMPONENTS: string[] = [
  CoreComponentName.Dummy,
  CoreComponentName.GridLayout,
];

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
          <Popover closeOnBlur placement="bottom">
            <PopoverTrigger>
              <Button
                _focus={{ boxShadow: 'none' }}
                bg="transparent"
                h="1.75rem"
                size="sm"
              >
                <FilterIcon />
              </Button>
            </PopoverTrigger>
            <chakra.div
              sx={{
                '.chakra-popover__popper': {
                  inset: '0px auto auto -3px !import',
                },
              }}
            >
              <PopoverContent
                mt="1"
                p="2"
                opacity="0"
                rounded="md"
                maxH="350px"
                shadow="base"
                zIndex="popover"
                overflowY="auto"
                width="200px"
                _focus={{ boxShadow: 'none' }}
              >
                {versions.map(version => {
                  return (
                    <Checkbox
                      key={version}
                      value={version}
                      onChange={e => {
                        const checked = e.target.checked;
                        const value = e.target.value;
                        const newCheckedVersions = [...checkedVersions];
                        if (checked) {
                          newCheckedVersions.push(value);
                        } else {
                          const idx = newCheckedVersions.findIndex(c => c === value);
                          newCheckedVersions.splice(idx, 1);
                        }
                        setCheckedVersions(newCheckedVersions);
                      }}
                    >
                      {version}
                    </Checkbox>
                  );
                })}
              </PopoverContent>
            </chakra.div>
          </Popover>
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
