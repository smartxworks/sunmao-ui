import { Box, Text, VStack } from '@chakra-ui/react';
import { ApplicationComponent } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import React, { useMemo, useState } from 'react';
import { eventBus } from '../../eventBus';
import { ComponentItemView } from './ComponentItemView';
import { DropComponentWrapper } from './DropComponentWrapper';
import { ChildrenMap } from './StructureTree';
import { genOperation } from '../../operations';

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
    const children = childrenMap.get(component.id);
    return slots.map(slot => {
      let slotContent;
      const slotChildren = children?.get(slot);
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
      const onCreateComponent = (creatingComponent: string) => {
        eventBus.send(
          'operation',
          genOperation('createComponent', {
            componentType: creatingComponent,
            parentId: component.id,
            slot,
          })
        );
      };

      const onMoveComponent = (movingComponent: string) => {
        if (movingComponent === component.id) return;
        eventBus.send(
          'operation',
          genOperation('moveComponent', {
            fromId: movingComponent,
            toId: component.id,
            slot,
          })
        );
      };

      const slotName = (
        <DropComponentWrapper onCreateComponent={onCreateComponent} onMoveComponent={onMoveComponent}>
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
  }, [slots, childrenMap, component.id, selectedComponentId, onSelectComponent, registry]);

  const onClickRemove = () => {
    eventBus.send(
      'operation',
      genOperation('removeComponent', {
        componentId: component.id,
      })
    );
  };

  const onCreateComponent = (creatingComponent: string) => {
    if (slots.length === 0) return;
    eventBus.send(
      'operation',
      genOperation('createComponent', {
        componentType: creatingComponent,
        parentId: component.id,
        slot: slots[0],
      })
    );
  };

  const onMoveUp = () => {
    eventBus.send(
      'operation',
      genOperation('adjustComponentOrder', {
        componentId: component.id,
        orientation: 'up',
      })
    );
  };

  const onMoveDown = () => {
    eventBus.send(
      'operation',
      genOperation('adjustComponentOrder', {
        componentId: component.id,
        orientation: 'down',
      })
    );
  };

  const onMoveComponent = (movingComponent: string) => {
    if (movingComponent === component.id) return;
    eventBus.send(
      'operation',
      genOperation('moveComponent', {
        fromId: movingComponent,
        toId: component.id,
        slot: slots[0],
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
      <DropComponentWrapper onCreateComponent={onCreateComponent} onMoveComponent={onMoveComponent}>
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
