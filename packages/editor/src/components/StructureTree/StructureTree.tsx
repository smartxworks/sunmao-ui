import React, { useMemo } from 'react';
import { ApplicationComponent } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { eventBus } from 'eventBus';
import { ComponentItemView } from './ComponentItemView';
import { ComponentTree } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { genOperation as genOperation } from 'operations';
import { resolveApplicationComponents } from 'utils/resolveApplicationComponents';

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

  const [realComponents, dataSources] = useMemo(() => {
    const _realComponent: ApplicationComponent[] = [];
    const _datasources: ApplicationComponent[] = [];
    components.forEach(c => {
      if (c.type === 'core/v1/dummy') {
        _datasources.push(c);
      } else {
        _realComponent.push(c);
      }
    });
    return [_realComponent, _datasources];
  }, [components]);

  const componentEles = useMemo(() => {
    const { topLevelComponents, childrenMap } = resolveApplicationComponents(realComponents);

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
  }, [realComponents, selectedComponentId, onSelectComponent, registry]);

  const dataSourceEles = useMemo(() => {
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
          id={dummy.id}
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
  }, [dataSources, selectedComponentId, onSelectComponent, registry]);

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
  const onCreateComponent = (creatingComponent: string) => {
    eventBus.send(
      'operation',
      genOperation('createComponent', {
        componentType: creatingComponent,
      })
    );
  };
  const onMoveComponent = (movingComponent: string) => {
    if (movingComponent === 'root') return;
    eventBus.send(
      'operation',
      genOperation('moveComponent', {
        fromId: movingComponent,
        toId: 'root',
        slot: 'root',
      })
    );
  };

  return (
    <Box width="full">
      <DropComponentWrapper
        onCreateComponent={onCreateComponent}
        onMoveComponent={onMoveComponent}
      >
        <ComponentItemView
          id={'root'}
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
