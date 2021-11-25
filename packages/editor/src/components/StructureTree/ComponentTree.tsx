import { Box, Text, VStack } from '@chakra-ui/react';
import { ApplicationComponent } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import React, { useMemo, useState } from 'react';
import { AddComponentOperation } from '../../operations/branch/addComponentOperation';
import { eventBus } from '../../eventBus';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { ChildrenMap } from './StructureTree';
import { RemoveComponentOperation } from '../../operations/branch/removeComponentOperation';
import { AdjustComponentOrderOperation } from '../../operations/leaf/component/adjustOrderOperation';

type Props = {
  registry: Registry;
  component: ApplicationComponent;
  childrenMap: ChildrenMap;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const ComponentTree: React.FC<Props> = props => {
  const { component, childrenMap, selectedComponentId, onSelectComponent, registry } =
    props;
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
              registry={registry}
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
      const onDrop = (creatingComponent: string) => {
        eventBus.send(
          'operation',
          new AddComponentOperation({
            componentType: creatingComponent,
            parentId: component.id,
            slot,
          })
        );
      };
      const slotName = (
        <DropComponentWrapper onDrop={onDrop}>
          <Text color="gray.500" fontWeight="medium">
            Slot: {slot}
          </Text>
        </DropComponentWrapper>
      );

      return (
        <Box key={slot} paddingLeft="3" width="full">
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
    eventBus.send(
      'operation',
      new RemoveComponentOperation({ componentId: component.id })
    );
  };

  const onDrop = (creatingComponent: string) => {
    if (slots.length === 0) return;
    eventBus.send(
      'operation',
      new AddComponentOperation({
        componentType: creatingComponent,
        parentId: component.id,
        slot: 'content',
      })
    );
  };

  const onMoveUp = () => {
    eventBus.send(
      'operation',
      new AdjustComponentOrderOperation({ componentId: component.id, orientation: 'up' })
    );
  };

  const onMoveDown = () => {
    eventBus.send(
      'operation',
      new AdjustComponentOrderOperation({
        componentId: component.id,
        orientation: 'down',
      })
    );
  };

  return (
    <VStack
      key={component.id}
      position="relative"
      spacing="2"
      width="full"
      alignItems="start"
    >
      <DropComponentWrapper onDrop={onDrop}>
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
          isDroppable={slots.length > 0}
          isSortable={true}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      </DropComponentWrapper>
      {isExpanded ? slotsEle : null}
    </VStack>
  );
};
