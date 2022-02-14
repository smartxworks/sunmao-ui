import React, { useMemo } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentItemView } from './ComponentItemView';
import { ComponentTree } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { genOperation } from '../../operations';
import { resolveApplicationComponents } from '../../utils/resolveApplicationComponents';
import ErrorBoundary from '../ErrorBoundary';
import { EditorServices } from '../../types';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ComponentSchema[]>;

type Props = {
  components: ComponentSchema[];
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  services: EditorServices;
};

export const StructureTree: React.FC<Props> = props => {
  const { components, selectedComponentId, onSelectComponent, services } = props;

  const [realComponents] = useMemo(() => {
    const _realComponent: ComponentSchema[] = [];
    const _datasources: ComponentSchema[] = [];
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
    const { topLevelComponents, childrenMap } =
      resolveApplicationComponents(realComponents);

    return topLevelComponents.map(c => (
      <ComponentTree
        key={c.id}
        component={c}
        childrenMap={childrenMap}
        selectedComponentId={selectedComponentId}
        onSelectComponent={onSelectComponent}
        services={services}
      />
    ));
  }, [realComponents, selectedComponentId, onSelectComponent, services]);

  return (
    <VStack spacing="2" padding="5" alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        Components
      </Text>
      <RootItem services={services} />
      {componentEles}
    </VStack>
  );
};

function RootItem(props: { services: EditorServices }) {
  const { eventBus, registry } = props.services;
  const onCreateComponent = (creatingComponent: string) => {
    eventBus.send(
      'operation',
      genOperation(registry, 'createComponent', {
        componentType: creatingComponent,
      })
    );
  };
  const onMoveComponent = (movingComponent: string) => {
    if (movingComponent === 'root') return;
    eventBus.send(
      'operation',
      genOperation(registry, 'moveComponent', {
        fromId: movingComponent,
        toId: '__root__',
        slot: '__root__',
      })
    );
  };

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
