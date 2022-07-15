import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { isEqual } from 'lodash';

type Props = {
  component: ComponentSchema;
  parentId: string | undefined;
  slot: string | undefined;
  onSelectComponent: (id: string) => void;
  onSelected?: (id: string) => void;
  services: EditorServices;
  isAncestorDragging: boolean;
  depth: number;
};
type ComponentTreeProps = Props & {
  slotMap: Map<string, ComponentSchema[]>;
  isSelected: boolean;
};

const ComponentTree = (props: ComponentTreeProps) => {
  const {
    component,
    slotMap,
    parentId,
    slot,
    isSelected,
    onSelectComponent,
    onSelected,
    services,
    isAncestorDragging,
    depth,
  } = props;
  const { registry, eventBus } = services;
  const slots = Object.keys(registry.getComponentByType(component.type).spec.slots);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const onChildSelected = useCallback(
    selectedId => {
      setIsExpanded(true);
      onSelected?.(selectedId);
    },
    [onSelected]
  );

  const slotsEle = useMemo(() => {
    if (slots.length === 0) {
      return undefined;
    }

    return slots.map(_slot => {
      let slotContent;
      const slotChildren = slotMap.get(_slot);
      const slotName = (
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
          <Text fontSize={12} color="gray.500" paddingLeft="3" paddingY={1}>
            Slot: {_slot}
          </Text>
        </DropComponentWrapper>
      );

      if (slotChildren && slotChildren.length > 0) {
        slotContent = slotChildren.map(c => {
          return (
            <ComponentTreeWrapper
              key={c.id}
              component={c}
              parentId={component.id}
              slot={_slot}
              onSelectComponent={onSelectComponent}
              onSelected={onChildSelected}
              services={services}
              isAncestorDragging={isAncestorDragging || isDragging}
              depth={depth + 1}
            />
          );
        });
      } else {
        slotContent = slotName;
      }

      return (
        <Box key={_slot} paddingLeft="3" width="full" display={isExpanded ? '' : 'none'}>
          {/* although component can have multiple slots, but for now, most components have only one slot
        so we hide slot name to save more view area */}
          {(slotChildren || []).length ? slotName : undefined}
          <VStack spacing="0" width="full" alignItems="start">
            {slotContent}
          </VStack>
        </Box>
      );
    });
  }, [
    slots,
    slotMap,
    component.id,
    onSelectComponent,
    onChildSelected,
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
      {slotsEle}
    </VStack>
  );
};

const MemoComponentTree: React.FC<ComponentTreeProps> = React.memo(
  ComponentTree,
  (oldProps, props) => {
    const { slotMap: oldSlotMap, ...oldRest } = oldProps;
    const { slotMap, ...rest } = props;
    const oldKeys = [...oldSlotMap.keys()];
    const keys = [...slotMap.keys()];
    // check whether adding or removing the components
    const isHasSameSlots = oldKeys.length === keys.length;
    // check whether the properties of the child components have changed
    // if the properties aren't changed, then it must have the same object reference
    const isSameSlotMap =
      isHasSameSlots &&
      oldKeys.every(key => {
        const oldChildren = oldSlotMap.get(key) || [];
        const children = slotMap.get(key) || [];

        return (
          oldChildren.length === children.length &&
          oldChildren.every((oldComponent, i) => oldComponent === children[i])
        );
      });

    return isSameSlotMap && isEqual(oldRest, rest);
  }
);

export const ComponentTreeWrapper: React.FC<Props> = observer(props => {
  const { services, component, onSelected } = props;
  const { editorStore } = services;
  const { selectedComponentId, resolvedComponents } = editorStore;
  const { childrenMap } = resolvedComponents;
  const slotMap = childrenMap.get(component.id);

  useEffect(() => {
    if (selectedComponentId === component.id) {
      onSelected?.(selectedComponentId);
    }
  }, [selectedComponentId, component.id, onSelected]);

  return (
    <MemoComponentTree
      {...props}
      isSelected={selectedComponentId === component.id}
      slotMap={slotMap || new Map()}
    />
  );
});
