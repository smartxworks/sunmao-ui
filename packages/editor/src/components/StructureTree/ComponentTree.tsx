import React, { useCallback } from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { isEqual, xor } from 'lodash';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';
import { ComponentNodeWithState } from './type';

const IndentPadding = 24;

type Props = ComponentNodeWithState & {
  services: EditorServices;
  onSelectComponent: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string) => void;
};

const ComponentTree = (props: Props) => {
  const {
    component,
    onSelectComponent,
    services,
    droppable,
    depth,
    isSelected,
    isExpanded,
    onToggleExpand,
    parentId,
    slot,
    shouldShowSelfSlotName,
    hasChildrenSlots,
    onDragStart,
    onDragEnd,
  } = props;
  const { registry, eventBus } = services;
  const slots = Object.keys(registry.getComponentByType(component.type).spec.slots);
  const paddingLeft = depth * IndentPadding;

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
  const onClickExpand = useCallback(() => {
    onToggleExpand(component.id);
  }, [component.id, onToggleExpand]);
  const _onDragStart = useCallback(
    () => onDragStart(component.id),
    [component.id, onDragStart]
  );
  const _onDragEnd = useCallback(
    () => onDragEnd(component.id),
    [component.id, onDragEnd]
  );
  const onMouseOver = useCallback(() => {
    services.editorStore.setHoverComponentId(component.id);
  }, [component.id, services.editorStore]);
  const onMouseLeave = useCallback(() => {
    services.editorStore.setHoverComponentId('');
  }, [services.editorStore]);
  const emptySlots = xor(hasChildrenSlots, slots);

  const emptyChildrenSlotsPlaceholder = isExpanded
    ? emptySlots.map(_slot => {
        return (
          <DropComponentWrapper
            key={_slot}
            parentId={component.id}
            parentSlot={_slot!}
            services={services}
            isExpanded={isExpanded}
            isDropInOnly
            droppable={droppable}
            hasSlot={true}
          >
            {_slot !== 'content' ? (
              <Text
                fontSize={12}
                color="gray.500"
                paddingY={1}
                paddingLeft={`${paddingLeft + IndentPadding}px`}
              >
                {_slot}
              </Text>
            ) : undefined}
            <Text
              fontSize={12}
              color="gray.500"
              paddingLeft={`${paddingLeft + IndentPadding + IndentPadding}px`}
            >
              Empty
            </Text>
          </DropComponentWrapper>
        );
      })
    : undefined;

  return (
    <VStack
      key={component.id}
      position="relative"
      spacing="0"
      width="full"
      alignItems="start"
      marginTop="0 !important"
    >
      {shouldShowSelfSlotName ? (
        <DropComponentWrapper
          parentId={parentId!}
          parentSlot={slot!}
          services={services}
          isExpanded={isExpanded}
          isDropInOnly
          droppable={droppable}
          hasSlot={true}
        >
          <Text
            fontSize={12}
            color="gray.500"
            paddingY={1}
            paddingLeft={`${paddingLeft}px`}
          >
            {slot}
          </Text>
        </DropComponentWrapper>
      ) : undefined}
      <DropComponentWrapper
        componentId={component.id}
        parentSlot={slot!}
        parentId={parentId!}
        services={props.services}
        isExpanded={isExpanded}
        droppable={droppable}
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
          onClickExpand={onClickExpand}
          onDragStart={_onDragStart}
          onDragEnd={_onDragEnd}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          paddingLeft={paddingLeft}
        />
        {emptyChildrenSlotsPlaceholder}
      </DropComponentWrapper>
    </VStack>
  );
};

const MemoComponentTree: React.FC<Props> = React.memo(
  ComponentTree,
  (prevProps, nextProps) => {
    const isSame =
      prevProps.component === nextProps.component &&
      prevProps.parentId === nextProps.parentId &&
      prevProps.slot === nextProps.slot &&
      prevProps.droppable === nextProps.droppable &&
      prevProps.depth === nextProps.depth &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.shouldShowSelfSlotName === nextProps.shouldShowSelfSlotName &&
      isEqual(prevProps.hasChildrenSlots, nextProps.hasChildrenSlots);
    return isSame;
  }
);

export const ComponentTreeWrapper = MemoComponentTree;
