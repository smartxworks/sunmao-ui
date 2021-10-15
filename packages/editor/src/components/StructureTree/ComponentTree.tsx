import { Box, Text, VStack } from '@chakra-ui/react';
import { ApplicationComponent } from '@meta-ui/core';
import React, { useMemo, useState } from 'react';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  CreateComponentOperation,
  RemoveComponentOperation,
} from '../../operations/Operations';
import { ComponentItemView } from './ComponentItemView';
import { ChildrenMap } from './StructureTree';

type Props = {
  component: ApplicationComponent;
  childrenMap: ChildrenMap;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const ComponentTree: React.FC<Props> = props => {
  const { component, childrenMap, selectedComponentId, onSelectComponent } = props;
  const slots = registry.getComponentByType(component.type).spec.slots;
  const [isExpanded, setIsExpanded] = useState(true);

  const slotsEle = useMemo(() => {
    if (slots.length === 0) {
      return null;
    }
    const slotsMap = childrenMap.get(component.id);
    return slots.map(slot => {
      let slotContent;
      const slotChildren = slotsMap?.get(slot);
      if (slotChildren && slotChildren.length > 0) {
        slotContent = slotChildren.map(c => {
          return (
            <ComponentTree
              key={c.id}
              component={c}
              childrenMap={childrenMap}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
            />
          );
        });
      } else {
        slotContent = (
          <Text fontSize="sm" color="gray.500">
            Empty
          </Text>
        );
      }
      const onDrop = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const creatingComponent = e.dataTransfer?.getData('component') || '';

        eventBus.send(
          'operation',
          new CreateComponentOperation(creatingComponent, component.id, slot)
        );
      };

      const slotName = (
        <Text color="gray.500" fontWeight="medium" onDrop={onDrop}>
          Slot: {slot}
        </Text>
      );

      return (
        <Box key={slot} paddingLeft="5" width="full" onDrop={onDrop}>
          {/* although component can have multiple slots, but for now, most components have only one slot
          so we hide slot name to save more view area */}
          {slots.length > 1 ? slotName : null}
          <VStack spacing="2" width="full" alignItems="start">
            {slotContent}
          </VStack>
        </Box>
      );
    });
  }, [component, childrenMap]);

  const onClickRemove = () => {
    eventBus.send('operation', new RemoveComponentOperation(component.id));
  };

  const onDropInComponent = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (slots.length === 0) return;

    const creatingComponent = e.dataTransfer?.getData('component') || '';

    eventBus.send(
      'operation',
      new CreateComponentOperation(creatingComponent, component.id, 'content')
    );
  };

  return (
    <VStack
      key={component.id}
      position="relative"
      spacing="2"
      width="full"
      alignItems="start"
      onDrop={onDropInComponent}
    >
      <ComponentItemView
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
      {isExpanded ? slotsEle : null}
    </VStack>
  );
};
