import React from 'react';
import { Application, ApplicationComponent } from '@meta-ui/core';
import { eventBus } from '../../eventBus';
import {
  CreateComponentOperation,
  RemoveComponentOperation,
} from '../../operations/Operations';
import { ComponentItemView } from './ComponentItemView';
import { ComponentTree } from './ComponentTree';
import { Box, Text, VStack } from '@chakra-ui/react';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ApplicationComponent[]>;

type Props = {
  app: Application;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const StructureTree: React.FC<Props> = props => {
  const { app, selectedComponentId, onSelectComponent } = props;
  const topLevelComponents: ApplicationComponent[] = [];
  const childrenMap: ChildrenMap = new Map();

  const components = app.spec.components.filter(c => c.type !== 'core/v1/dummy');
  const dataSources = app.spec.components.filter(c => c.type === 'core/v1/dummy');

  // parse components array to slotsMap
  components.forEach(c => {
    const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
    if (slotTrait) {
      const { id: parentId, slot } = slotTrait.properties.container as any;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, new Map());
      }
      if (!childrenMap.get(parentId)?.has(slot)) {
        childrenMap.get(parentId)?.set(slot, []);
      }

      childrenMap.get(parentId)!.get(slot)!.push(c);
    } else {
      topLevelComponents.push(c);
    }
  });

  const topEles = topLevelComponents.map(c => (
    <ComponentTree
      key={c.id}
      component={c}
      childrenMap={childrenMap}
      selectedComponentId={selectedComponentId}
      onSelectComponent={onSelectComponent}
    />
  ));
  const dataSourcesEles = dataSources.map(dummy => {
    const onClickRemove = () => {
      eventBus.send('operation', new RemoveComponentOperation(dummy.id));
    };
    return (
      <ComponentItemView
        key={dummy.id}
        title={dummy.id}
        isSelected={dummy.id === selectedComponentId}
        onClick={() => {
          onSelectComponent(dummy.id);
        }}
        onClickRemove={onClickRemove}
        noChevron={true}
      />
    );
  });

  return (
    <VStack spacing="2" padding="5" alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        Components
      </Text>
      <RootItem />
      {topEles}
      <Text fontSize="lg" fontWeight="bold">
        DataSources
      </Text>
      {dataSourcesEles}
    </VStack>
  );
};

function RootItem() {
  const onDrop = (e: React.DragEvent) => {
    const creatingComponent = e.dataTransfer?.getData('component') || '';

    eventBus.send('operation', new CreateComponentOperation(creatingComponent));
  };
  return (
    <Box onDrop={onDrop} width="full">
      <ComponentItemView
        title="Root"
        isSelected={false}
        onClick={() => undefined}
        isDroppable={true}
        noChevron={true}
      />
    </Box>
  );
}
