import React, { useEffect, useState } from 'react';
import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { eventBus } from '../../eventBus';
import { ComponentItemView } from './ComponentItemView';
import { ComponentTree } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ApplicationInstance } from '../../setup';
import {
  RemoveComponentBranchOperation,
  CreateComponentBranchOperation,
} from '../../operations/branch';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ApplicationComponent[]>;

type Props = {
  registry: Registry;
  app: Application;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const StructureTree: React.FC<Props> = props => {
  const { app, selectedComponentId, onSelectComponent, registry } = props;
  const [topEles, setTopEles] = useState(new Array<EmotionJSX.Element>());
  const [dataSourcesEles, setDataSourcesEles] = useState(new Array<EmotionJSX.Element>());
  //FIXME: it is not the proper place to initialize and detect change of the schema data, move it to a higher layer
  useEffect(() => {
    const topLevelComponents: ApplicationComponent[] = [];
    const childrenMap: ChildrenMap = new Map();

    ApplicationInstance.components = app.spec.components.filter(
      c => c.type !== 'core/v1/dummy'
    );
    ApplicationInstance.dataSources = app.spec.components.filter(
      c => c.type === 'core/v1/dummy'
    );
    ApplicationInstance.components.forEach(c => {
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
    ApplicationInstance.childrenMap = childrenMap;

    setTopEles(
      topLevelComponents.map(c => (
        <ComponentTree
          key={c.id}
          component={c}
          childrenMap={childrenMap}
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
          registry={registry}
        />
      ))
    );
    setDataSourcesEles(
      ApplicationInstance.dataSources.map(dummy => {
        const onClickRemove = () => {
          eventBus.send(
            'operation',
            new RemoveComponentBranchOperation({
              componentId: dummy.id,
            })
          );
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
      })
    );
  }, [app.spec.components]);

  // parse components array to slotsMap

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
  const onDrop = (creatingComponent: string) => {
    eventBus.send(
      'operation',
      new CreateComponentBranchOperation({
        componentType: creatingComponent,
      })
    );
  };
  return (
    <Box width="full">
      <DropComponentWrapper onDrop={onDrop}>
        <ComponentItemView
          title="Root"
          isSelected={false}
          onClick={() => undefined}
          isDroppable={true}
          noChevron={true}
        />
      </DropComponentWrapper>
    </Box>
  );
}
