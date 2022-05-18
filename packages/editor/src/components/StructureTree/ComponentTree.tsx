import React, { useMemo, useState, useCallback } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { ChildrenMap } from './StructureTree';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';

type Props = {
  component: ComponentSchema;
  parentId: string | undefined;
  slot: string | undefined;
  childrenMap: ChildrenMap;
  onSelectComponent: (id: string) => void;
  services: EditorServices;
  isAncestorDragging: boolean;
  depth: number;
};
type ComponentTreeProps = Props & {
  isSelected: boolean;
};

const observeSelected = (Component: React.FC<ComponentTreeProps>) => {
  const ObserveActive: React.FC<Props> = props => {
    const { services } = props;
    const { editorStore } = services;
    const { selectedComponentId } = editorStore;

    return (
      <Component {...props} isSelected={selectedComponentId === props.component.id} />
    );
  };

  return observer(ObserveActive);
};

const ComponentTree = (props: ComponentTreeProps) => {
  const {
    component,
    childrenMap,
    parentId,
    slot,
    isSelected,
    onSelectComponent,
    services,
    isAncestorDragging,
    depth,
  } = props;
  const { registry, eventBus } = services;
  const slots = registry.getComponentByType(component.type).spec.slots;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const slotsEle = useMemo(() => {
    if (slots.length === 0) {
      return undefined;
    }
    const children = childrenMap.get(component.id);
    return slots.map(_slot => {
      let slotContent;
      const slotChildren = children?.get(_slot);
      if (slotChildren && slotChildren.length > 0) {
        slotContent = slotChildren.map(c => {
          return (
            <ComponentTreeWrapper
              key={c.id}
              component={c}
              parentId={component.id}
              slot={_slot}
              childrenMap={childrenMap}
              onSelectComponent={onSelectComponent}
              services={services}
              isAncestorDragging={isAncestorDragging || isDragging}
              depth={depth + 1}
            />
          );
        });
      } else {
        slotContent = (
          <DropComponentWrapper
            componentId={undefined}
            parentId={component.id}
            parentSlot={_slot}
            services={services}
            isExpanded={isExpanded}
            isDropInOnly
            droppable={!isAncestorDragging && !isDragging}
            hasSlot={true}
          >
            <Text fontSize="sm" color="gray.500">
              Empty
            </Text>
          </DropComponentWrapper>
        );
      }

      const slotName = (
        <Text color="gray.500" fontWeight="medium">
          Slot: {_slot}
        </Text>
      );

      return (
        <Box key={_slot} paddingLeft="3" width="full">
          {/* although component can have multiple slots, but for now, most components have only one slot
        so we hide slot name to save more view area */}
          {slots.length > 1 ? slotName : undefined}
          <VStack spacing="0" width="full" alignItems="start">
            {slotContent}
          </VStack>
        </Box>
      );
    });
  }, [
    slots,
    childrenMap,
    component.id,
    onSelectComponent,
    services,
    isAncestorDragging,
    isDragging,
    depth,
    isExpanded,
  ]);

  const onClickRemove = useCallback(() => {
    eventBus.send(
      'operation',
      genOperation(registry, 'removeComponent', {
        componentId: component.id,
      })
    );
  }, [component.id, eventBus, registry]);
  const onClickItem = useCallback(() => {
    onSelectComponent(component.id);
  }, [component.id, onSelectComponent]);
  const onToggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);
  const onDragStart = useCallback(() => setIsDragging(true), []);
  const onDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <VStack
      key={component.id}
      position="relative"
      spacing="0"
      width="full"
      alignItems="start"
      marginTop="0 !important"
    >
      <DropComponentWrapper
        componentId={component.id}
        parentSlot={slot}
        parentId={parentId}
        services={props.services}
        isExpanded={isExpanded}
        droppable={!isAncestorDragging && !isDragging}
        hasSlot={slots.length > 0}
      >
        <ComponentItemView
          id={component.id}
          title={component.id}
          isSelected={isSelected}
          onClick={onClickItem}
          onClickRemove={onClickRemove}
          noChevron={slots.length === 0}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          depth={depth}
        />
      </DropComponentWrapper>
      {isExpanded ? slotsEle : undefined}
    </VStack>
  );
};

export const ComponentTreeWrapper: React.FC<Props> = observeSelected(
  React.memo(ComponentTree)
);
