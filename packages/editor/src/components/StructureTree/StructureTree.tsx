import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ComponentTreeWrapper } from './ComponentTree';
import { DropComponentWrapper } from './DropComponentWrapper';
import { resolveApplicationComponents } from '../../utils/resolveApplicationComponents';
import ErrorBoundary from '../ErrorBoundary';
import { EditorServices } from '../../types';
import { CORE_VERSION, CoreTraitName, CoreComponentName, memo } from '@sunmao-ui/shared';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  type Item,
} from '@choc-ui/chakra-autocomplete';
import { css } from '@emotion/css';
import { isEqual } from 'lodash-es';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ComponentSchema[]>;

type Props = {
  components: ComponentSchema[];
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  services: EditorServices;
};

const AutoCompleteStyle = css`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;
const SLOT_TYPE = `${CORE_VERSION}/${CoreTraitName.Slot}`;

const memoResolveApplicationComponents = memo(
  resolveApplicationComponents,
  function ([preRealComponents = []] = [], [realComponents]) {
    // if add or remove the component, the struct tree should update
    if (preRealComponents.length !== realComponents.length) {
      return false;
    }

    for (const i in realComponents) {
      const preComponent = preRealComponents[i];
      const component = realComponents[i];

      if (preComponent !== component) {
        // there are two situations would cause the ids are different
        // 1. the component id is changed
        // 2. the order of components is changed. example: [a, b] -> [b, a]
        if (preComponent.id !== component.id) {
          return false;
        }

        // should check the slot container whether is changed too because move a component to a slot may not change the order
        const preSlotTrait = preComponent.traits.find(trait => trait.type === SLOT_TYPE);
        const slotTrait = component.traits.find(trait => trait.type === SLOT_TYPE);

        if (
          !isEqual(preSlotTrait?.properties.container, slotTrait?.properties.container)
        ) {
          return false;
        }
      }
    }

    return true;
  }
);

export const StructureTree: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const { components, onSelectComponent, services } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onSelectOption = useCallback(
    ({ item }: { item: Item }) => {
      onSelectComponent(item.value);
      setSearch(item.value);
    },
    [onSelectComponent]
  );
  const onSelected = useCallback(selectedId => {
    if (selectedId) {
      // wait the component tree to be expanded
      setTimeout(() => {
        wrapperRef.current?.querySelector(`#tree-item-${selectedId}`)?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      });
    }
  }, []);
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      setSearch(event.target.value);
    },
    []
  );

  const realComponents = useMemo(() => {
    return components.filter(
      c => c.type !== `${CORE_VERSION}/${CoreComponentName.Dummy}`
    );
  }, [components]);

  const componentEles = useMemo(() => {
    const { topLevelComponents, childrenMap } =
      memoResolveApplicationComponents(realComponents);

    return topLevelComponents.map(c => (
      <ComponentTreeWrapper
        key={c.id}
        component={c}
        parentId={undefined}
        slot={undefined}
        childrenMap={childrenMap}
        onSelectComponent={onSelectComponent}
        onSelected={onSelected}
        services={services}
        isAncestorDragging={false}
        depth={0}
      />
    ));
  }, [realComponents, onSelectComponent, onSelected, services]);

  return (
    <VStack
      ref={wrapperRef}
      height="full"
      paddingY="4"
      alignItems="start"
      overflowX="hidden"
      overflowY="auto"
    >
      <VStack alignItems="start" width="full" paddingX="4">
        <Text fontSize="lg" fontWeight="bold">
          Components
        </Text>
        <AutoComplete
          openOnFocus
          onSelectOption={onSelectOption}
          className={AutoCompleteStyle}
        >
          <AutoCompleteInput
            value={search}
            placeholder="Search component"
            size="md"
            variant="filled"
            marginTop={0}
            onChange={onSearchChange}
          />
          <AutoCompleteList>
            {realComponents.map(component => (
              <AutoCompleteItem key={component.id} value={component.id}>
                {component.id}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </VStack>
      <Box width="full" flex={1} minHeight={0} overflowY="auto" overflowX="hidden">
        {componentEles.length > 0 ? (
          componentEles
        ) : (
          <Box padding="4">
            <Placeholder services={services} />
          </Box>
        )}
      </Box>
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
