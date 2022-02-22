import React, { useMemo, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { ChildrenMap } from './StructureTree';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';

type Props = {
  component: ComponentSchema;
  parentId: string | undefined;
  slot: string | undefined;
  childrenMap: ChildrenMap;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  services: EditorServices;
};

export const ComponentTree: React.FC<Props> = props => {
  const {
    component,
    childrenMap,
    parentId,
    slot,
    selectedComponentId,
    onSelectComponent,
    services,
  } = props;
  const { registry, eventBus } = services;
  const slots = registry.getComponentByType(component.type).spec.slots;
  const [isExpanded, setIsExpanded] = useState(true);

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
            <ComponentTree
              key={c.id}
              component={c}
              parentId={component.id}
              slot={_slot}
              childrenMap={childrenMap}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              services={services}
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
    selectedComponentId,
    onSelectComponent,
    services,
    isExpanded,
  ]);

  const onClickRemove = () => {
    eventBus.send(
      'operation',
      genOperation(registry, 'removeComponent', {
        componentId: component.id,
      })
    );
  };

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
      >
        <ComponentItemView
          id={component.id}
          title={component.id}
          isSelected={component.id === selectedComponentId}
          onClick={() => {
            onSelectComponent(component.id);
          }}
          onClickRemove={onClickRemove}
          noChevron={slots.length === 0}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(prev => !prev)}
        />
      </DropComponentWrapper>
      {isExpanded ? slotsEle : undefined}
    </VStack>
  );
};
