import React, { useRef, useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import scrollIntoView from 'scroll-into-view';
import { observer } from 'mobx-react-lite';
import { ComponentNode } from './ComponentNode';
import { DropComponentWrapper } from './DropComponentWrapper';
import ErrorBoundary from '../ErrorBoundary';
import { useStructureTreeState } from './useStructureTreeState';
import { ComponentSearch } from './ComponentSearch';
import { EditorServices } from '../../types';

type Props = {
  services: EditorServices;
};

export const StructureTree: React.FC<Props> = observer(props => {
  const { editorStore } = props.services;
  const { setSelectedComponentId, selectedComponentId, components } = editorStore;
  const scrollWrapper = useRef<HTMLDivElement>(null);

  const {
    shouldRenderNodes,
    expandedMap,
    onToggleExpand,
    expandNode,
    undroppableMap,
    setDraggingId,
  } = useStructureTreeState(editorStore);

  // auto expand and scroll node into view when the node is selected
  useEffect(() => {
    expandNode(selectedComponentId);

    setTimeout(() => {
      const selectedElement: HTMLElement | undefined | null =
        scrollWrapper.current?.querySelector(`#tree-item-${selectedComponentId}`);

      const wrapperRect = scrollWrapper.current?.getBoundingClientRect();
      const eleRect = selectedElement?.getBoundingClientRect();
      // check whether selected node is outside of view
      if (
        selectedElement &&
        eleRect &&
        wrapperRect &&
        (eleRect.top < wrapperRect.top ||
          eleRect.top > wrapperRect.top + wrapperRect?.height)
      ) {
        scrollIntoView(selectedElement, { align: { lockX: true } });
      }
    });
  }, [expandNode, selectedComponentId]);

  const componentEles = shouldRenderNodes.map((node, i) => {
    const prevNode = i > 0 ? shouldRenderNodes[i - 1] : null;
    let shouldShowSlot = false;
    // Conditions in which a component should show the slot name it belongs
    // 1. It is in a slot and the slot is not 'content' or the slot is 'content' but its parent slot is not unique.
    // 2. And its previous node is its parent(has the same parent).
    // 3. Or its previous node is its sibling and is in different slot.
    if (
      node.slot &&
      !(node.parentSlots!.length === 1 && node.slot === 'content') &&
      prevNode
    ) {
      const prevNodeIsParent = prevNode.id === node.parentId;
      const prevNodeInDifferentSlot =
        prevNode.parentId === node.parentId && prevNode.slot !== node.slot;
      shouldShowSlot = prevNodeIsParent || prevNodeInDifferentSlot;
    }
    return (
      <ComponentNode
        id={node.id}
        key={node.id}
        component={node.component}
        parentId={node.parentId}
        slot={node.slot}
        onSelectComponent={setSelectedComponentId}
        services={props.services}
        droppable={!undroppableMap[node.id]}
        depth={node.depth}
        isSelected={editorStore.selectedComponent?.id === node.id}
        isExpanded={!!expandedMap[node.id]}
        onToggleExpand={onToggleExpand}
        shouldShowSelfSlotName={shouldShowSlot}
        notEmptySlots={node.notEmptySlots}
        onDragStart={id => setDraggingId(id)}
        onDragEnd={() => setDraggingId('')}
      />
    );
  });

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
        <ComponentSearch
          tags={[]}
          checkedTags={[]}
          onTagsChange={() => null}
          components={components}
          onChange={id => setSelectedComponentId(id)}
          services={props.services}
        />
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
            <Placeholder services={props.services} />
          </Box>
        )}
      </Box>
    </VStack>
  );
});

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
