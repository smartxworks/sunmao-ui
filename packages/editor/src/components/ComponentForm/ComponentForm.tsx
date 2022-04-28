import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { SpecWidget } from '@sunmao-ui/editor-sdk';
import { TSchema } from '@sinclair/typebox';
import { parseType } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/runtime';

import { EventTraitForm } from './EventTraitForm';
import { GeneralTraitFormList } from './GeneralTraitFormList';
import { genOperation } from '../../operations';
import ErrorBoundary from '../ErrorBoundary';
import { StyleTraitForm } from './StyleTraitForm';
import { EditorServices } from '../../types';

type Props = {
  services: EditorServices;
};

export const ComponentForm: React.FC<Props> = observer(props => {
  const { services } = props;
  const { editorStore, registry, eventBus } = services;
  const { selectedComponent, selectedComponentId } = editorStore;
  if (!selectedComponentId) {
    return <Text p={2} fontSize='md'>No components selected. Click on a component to select it.</Text>;
  }

  if (!selectedComponent) {
    return <Text  p={2} fontSize='md'>Cannot find component with id: {selectedComponentId}.</Text>;
  }
  const { version, name } = parseType(selectedComponent.type);
  const cImpl = registry.getComponent(version, name);
  const properties = Object.assign(
    parseTypeBox(cImpl.spec.properties as TSchema),
    selectedComponent.properties
  );

  const changeComponentId = (selectedComponentId: string, value: string) => {
    eventBus.send(
      'operation',
      genOperation(registry, 'modifyComponentId', {
        componentId: selectedComponentId,
        newId: value,
      })
    );
    editorStore.setSelectedComponentId(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  return (
    <ErrorBoundary>
      <VStack p="2" spacing="2" background="gray.50" onKeyDown={onKeyDown}>
        <FormControl>
          <FormLabel>
            <strong>Component Type</strong>
          </FormLabel>
          <Text paddingLeft='3'>{selectedComponent.type}</Text>
        </FormControl>
        <FormControl>
          <FormLabel>
            <strong>Component ID</strong>
          </FormLabel>
          <Input
            key={selectedComponent.id}
            defaultValue={selectedComponent.id}
            background="white"
            onBlur={e => changeComponentId(selectedComponent?.id, e.target.value)}
          />
        </FormControl>
        <VStack width="full" alignItems="start">
          <strong>Properties</strong>
          <VStack width="full" background="white">
            <SpecWidget
              key={selectedComponent.id}
              component={selectedComponent}
              spec={cImpl.spec.properties}
              value={properties}
              path={[]}
              level={0}
              onChange={newFormData => {
                eventBus.send(
                  'operation',
                  genOperation(registry, 'modifyComponentProperty', {
                    componentId: selectedComponentId,
                    properties: newFormData,
                  })
                );
              }}
              services={services}
            />
          </VStack>
        </VStack>
        <EventTraitForm component={selectedComponent} services={services} />
        <StyleTraitForm component={selectedComponent} services={services} />
        <GeneralTraitFormList component={selectedComponent} services={services} />
      </VStack>
    </ErrorBoundary>
  );
});
