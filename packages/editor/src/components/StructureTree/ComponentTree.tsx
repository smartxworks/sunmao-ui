import { Box, Text } from '@chakra-ui/react';
import { ApplicationComponent } from '@meta-ui/core';
import React, { useMemo } from 'react';
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
        const creatingComponent = e.dataTransfer?.getData('component') || '';

        eventBus.send(
          'operation',
          new CreateComponentOperation(creatingComponent, component.id, slot)
        );
      };
      return (
        <Box key={slot} paddingLeft="6">
          <Text color="gray.500" fontWeight="medium" onDrop={onDrop}>
            Slot: {slot}
          </Text>
          {slotContent}
        </Box>
      );
    });
  }, [component, childrenMap]);

  const onClickRemove = () => {
    eventBus.send('operation', new RemoveComponentOperation(component.id));
  };

  return (
    <Box key={component.id} width="full">
      <ComponentItemView
        title={component.id}
        isSelected={component.id === selectedComponentId}
        onClick={() => {
          onSelectComponent(component.id);
        }}
        onClickRemove={onClickRemove}
      />
      {slotsEle}
    </Box>
  );
};
