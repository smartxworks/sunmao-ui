import React, { useCallback } from 'react';
import { CopyIcon, DeleteIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
} from '@chakra-ui/react';
import { isEqual, xor } from 'lodash';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';
import { ComponentNodeWithState } from './type';
import { AppModel } from '../../AppModel/AppModel';
import { ComponentId } from '../../AppModel/IAppModel';
import { RootId } from '../../constants';

const IndextWidth = 24;

type Props = ComponentNodeWithState & {
  services: EditorServices;
  onSelectComponent: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string) => void;
  prefix?: React.ReactNode;
};

const ComponentNodeImpl = (props: Props) => {
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
    notEmptySlots,
    onDragStart,
    onDragEnd,
    prefix,
  } = props;
  const { registry, eventBus, appModelManager } = services;
  const slots = Object.keys(registry.getComponentByType(component.type).spec.slots);
  const paddingLeft = depth * IndextWidth;

  const onClickRemove = useCallback(() => {
    eventBus.send(
      'operation',
      genOperation(registry, 'removeComponent', {
        componentId: component.id,
      })
    );
  }, [component.id, eventBus, registry]);
  const onClickDuplicate = useCallback(() => {
    const copiedComponents = appModelManager.appModel.getComponentById(
      component.id as ComponentId
    );
    const clonedComponent = new AppModel(
      copiedComponents!.allComponents.map(c => c.toSchema()),
      registry
    ).getComponentById(component.id as ComponentId);
    eventBus.send(
      'operation',
      genOperation(registry, 'pasteComponent', {
        parentId: parentId || RootId,
        slot: slot || '',
        component: clonedComponent!,
      })
    );
  }, [appModelManager.appModel, component.id, eventBus, parentId, registry, slot]);

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
  const emptySlots = xor(notEmptySlots, slots);

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
                paddingLeft={`${paddingLeft + IndextWidth}px`}
              >
                {_slot}
              </Text>
            ) : undefined}
            <Text
              height="32px"
              lineHeight="32px"
              fontSize={14}
              color="gray.500"
              paddingLeft={`${paddingLeft + IndextWidth * 2}px`}
            >
              Empty
            </Text>
          </DropComponentWrapper>
        );
      })
    : undefined;

  const actionMenu = (
    <Menu isLazy gutter={4}>
      <MenuButton
        as={IconButton}
        variant="ghost"
        height="24px"
        width="24px"
        minWidth="24px"
        marginInlineEnd="8px !important"
        icon={<HamburgerIcon width="16px" height="16px" />}
        onClick={e => e.stopPropagation()}
      />
      <MenuList>
        <MenuItem icon={<CopyIcon />} onClick={onClickDuplicate}>
          Duplicate
        </MenuItem>
        <MenuItem icon={<DeleteIcon />} color="red.500" onClick={onClickRemove}>
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );

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
          noChevron={slots.length === 0}
          isExpanded={isExpanded}
          onClickExpand={onClickExpand}
          onDragStart={_onDragStart}
          onDragEnd={_onDragEnd}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          paddingLeft={paddingLeft}
          actionMenu={actionMenu}
          prefix={prefix}
        />
      </DropComponentWrapper>
      {emptyChildrenSlotsPlaceholder}
    </VStack>
  );
};

const MemoComponentNode: React.FC<Props> = React.memo(
  ComponentNodeImpl,
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
      isEqual(prevProps.notEmptySlots, nextProps.notEmptySlots);
    return isSame;
  }
);

export const ComponentNode = MemoComponentNode;
