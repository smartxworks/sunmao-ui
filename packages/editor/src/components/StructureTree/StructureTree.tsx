import React, { useMemo } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentTree } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { resolveApplicationComponents } from '../../utils/resolveApplicationComponents';
import ErrorBoundary from '../ErrorBoundary';
import { EditorServices } from '../../types';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';

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

  const realComponents = useMemo(() => {
    return components.filter(c => c.type !== `${CORE_VERSION}/${CoreComponentName.Dummy}`);
  }, [components]);

  const componentEles = useMemo(() => {
    const { topLevelComponents, childrenMap } =
      resolveApplicationComponents(realComponents);

    return topLevelComponents.map(c => (
      <ComponentTree
        key={c.id}
        component={c}
        parentId={undefined}
        slot={undefined}
        childrenMap={childrenMap}
        selectedComponentId={selectedComponentId}
        onSelectComponent={onSelectComponent}
        services={services}
        isAncestorDragging={false}
        depth={0}
      />
    ));
  }, [realComponents, selectedComponentId, onSelectComponent, services]);

  return (
    <VStack spacing="2" padding="5" alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        Components
      </Text>
      {componentEles.length > 0 ? componentEles : <Placeholder services={services} />}
    </VStack>
  );
};

function Placeholder(props: { services: EditorServices }) {
  return (
    <ErrorBoundary>
      <Box width="full">
        <DropComponentWrapper
          componentId={undefined}
          parentId={undefined}
          parentSlot={undefined}
          services={props.services}
          isDropInOnly
          isExpanded={false}
          droppable
          hasSlot={true}
        >
          <Text padding="2" border="2px dashed" color="gray.400" borderColor="gray.400">
            There is no components now. You can drag component into here to create it.
          </Text>
        </DropComponentWrapper>
      </Box>
    </ErrorBoundary>
  );
}
