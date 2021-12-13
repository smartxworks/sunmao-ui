import React, { useMemo } from 'react';
import { ApplicationComponent } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { eventBus } from '../../eventBus';
import { ComponentItemView } from './ComponentItemView';
import { ComponentTree } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { genOperation as genOperation } from '../../operations';
import { resolveApplicationComponents } from '../../utils/resolveApplicationComponents';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ApplicationComponent[]>;

type Props = {
  registry: Registry;
  components: ApplicationComponent[];
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const StructureTree: React.FC<Props> = props => {
  const { components, selectedComponentId, onSelectComponent, registry } = props;

  const componentEles = useMemo(() => {
    const { topLevelComponents, childrenMap } = resolveApplicationComponents(components)

    return topLevelComponents.map(c => (
      <ComponentTree
        key={c.id}
        component={c}
        childrenMap={childrenMap}
        selectedComponentId={selectedComponentId}
        onSelectComponent={onSelectComponent}
        registry={registry}
      />
    ));
  }, [components, selectedComponentId, onSelectComponent, registry]);

  const dataSourceEles = useMemo(() => {
    const dataSources = components.filter(c => c.type === 'core/v1/dummy');
    return dataSources.map(dummy => {
      const onClickRemove = () => {
        eventBus.send(
          'operation',
          genOperation('removeComponent', {
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
    });
  }, [components, selectedComponentId, onSelectComponent, registry]);

  return (
    <VStack spacing="2" padding="5" alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        Components
      </Text>
      <RootItem />
      {componentEles}
      <Text fontSize="lg" fontWeight="bold">
        DataSources
      </Text>
      {dataSourceEles}
    </VStack>
  );
};

function RootItem() {
  const onDrop = (creatingComponent: string) => {
    eventBus.send(
      'operation',
      genOperation('createComponent', {
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
