import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentTreeWrapper } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import ErrorBoundary from '../ErrorBoundary';
import { EditorServices } from '../../types';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  type Item,
} from '@choc-ui/chakra-autocomplete';
import { css } from '@emotion/css';
import scrollIntoView from 'scroll-into-view';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ComponentSchema[]>;

type Props = {
  components: ComponentSchema[];
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  services: EditorServices;
};

const AutoCompleteStyle = css`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

export const StructureTree: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const { components, onSelectComponent, services } = props;
  const { editorStore } = services;
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const onSelectOption = useCallback(
    ({ item }: { item: Item }) => {
      onSelectComponent(item.value);
      setSearch(item.value);
    },
    [onSelectComponent]
  );
  const onSelected = useCallback(selectedId => {
    if (selectedId) {
      // wait the component tree to be expanded
      setTimeout(() => {
        const selectedElement: HTMLElement | undefined | null =
          scrollWrapper.current?.querySelector(`#tree-item-${selectedId}`);

        const wrapperRect = scrollWrapper.current?.getBoundingClientRect();
        const eleRect = selectedElement?.getBoundingClientRect();
        if (
          selectedElement &&
          eleRect &&
          wrapperRect &&
          (eleRect.top < wrapperRect.top ||
            eleRect.top > wrapperRect.top + wrapperRect?.height)
        ) {
          // check selected element is outside of view
          scrollIntoView(selectedElement, { time: 300, align: { lockX: true } });
        }
      });
    }
  }, []);
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      setSearch(event.target.value);
    },
    []
  );

  const realComponents = useMemo(() => {
    return components.filter(
      c => c.type !== `${CORE_VERSION}/${CoreComponentName.Dummy}`
    );
  }, [components]);

  const componentEles = useMemo(() => {
    const { topLevelComponents } = editorStore.resolvedComponents;

    return topLevelComponents.map(c => (
      <ComponentTreeWrapper
        key={c.id}
        component={c}
        parentId={undefined}
        slot={undefined}
        onSelectComponent={onSelectComponent}
        onSelected={onSelected}
        services={services}
        isAncestorDragging={false}
        depth={0}
      />
    ));
  }, [onSelectComponent, onSelected, services, editorStore.resolvedComponents]);

  return (
    <VStack
      height="full"
      paddingY="4"
      alignItems="start"
      overflowX="hidden"
      overflowY="auto"
    >
      <VStack alignItems="start" width="full" paddingX="4">
        <Text fontSize="lg" fontWeight="bold">
          Components
        </Text>
        <AutoComplete
          openOnFocus
          onSelectOption={onSelectOption}
          className={AutoCompleteStyle}
        >
          <AutoCompleteInput
            value={search}
            placeholder="Search component"
            size="md"
            variant="filled"
            marginTop={0}
            onChange={onSearchChange}
          />
          <AutoCompleteList>
            {realComponents.map(component => (
              <AutoCompleteItem key={component.id} value={component.id}>
                {component.id}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </VStack>
      <Box
        ref={scrollWrapper}
        width="full"
        flex={1}
        minHeight={0}
        overflowY="auto"
        overflowX="hidden"
      >
        {componentEles.length > 0 ? (
          componentEles
        ) : (
          <Box padding="4">
            <Placeholder services={services} />
          </Box>
        )}
      </Box>
    </VStack>
  );
};

function Placeholder(props: { services: EditorServices }) {
  return (
    <ErrorBoundary>
      <Box width="full">
        <DropComponentWrapper
          componentId={undefined}
          parentId={undefined}
          parentSlot={undefined}
          services={props.services}
          isDropInOnly
          isExpanded={false}
          droppable
          hasSlot={true}
        >
          <Text padding="2" border="2px dashed" color="gray.400" borderColor="gray.400">
            There is no components now. You can drag component into here to create it.
          </Text>
        </DropComponentWrapper>
      </Box>
    </ErrorBoundary>
  );
}
