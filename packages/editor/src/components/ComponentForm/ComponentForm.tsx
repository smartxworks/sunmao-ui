import React from 'react';
import { observer } from 'mobx-react-lite';
import { Accordion, Input, Text, VStack } from '@chakra-ui/react';
import { SpecWidget } from '@sunmao-ui/editor-sdk';
import { TSchema } from '@sinclair/typebox';
import { parseType } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/shared';

import { EventTraitForm } from './EventTraitForm';
import { GeneralTraitFormList } from './GeneralTraitFormList';
import { genOperation } from '../../operations';
import ErrorBoundary from '../ErrorBoundary';
import { StyleTraitForm } from './StyleTraitForm';
import { EditorServices } from '../../types';
import { FormSection } from './FormSection';

type Props = {
  services: EditorServices;
};

export const ComponentForm: React.FC<Props> = observer(props => {
  const { services } = props;
  const { editorStore, registry, eventBus } = services;
  const { selectedComponent, selectedComponentId } = editorStore;
  if (!selectedComponentId) {
    return (
      <Text p={2} fontSize="md">
        No components selected. Click on a component to select it.
      </Text>
    );
  }

  if (!selectedComponent) {
    return (
      <Text p={2} fontSize="md">
        Cannot find component with id: {selectedComponentId}.
      </Text>
    );
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
      <Accordion
        defaultIndex={[0, 1, 2, 3, 4, 5]}
        background="gray.50"
        paddingBottom="200px"
        allowMultiple
        onKeyDown={onKeyDown}
      >
        <FormSection title="Component Type">
          <Text paddingLeft="3">{selectedComponent.type}</Text>
        </FormSection>
        <FormSection title="Component ID">
          <Input
            key={selectedComponent.id}
            background="white"
            border="1px solid"
            borderColor="gray.400"
            defaultValue={selectedComponent.id}
            onBlur={e => changeComponentId(selectedComponent?.id, e.target.value)}
          />
        </FormSection>
        <FormSection title="Properties">
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
        </FormSection>
        <FormSection title="Events">
          <EventTraitForm component={selectedComponent} services={services} />
        </FormSection>
        <FormSection title="Styles">
          <StyleTraitForm
            key={selectedComponentId}
            component={selectedComponent}
            services={services}
          />
        </FormSection>
        <FormSection title="Traits">
          <GeneralTraitFormList component={selectedComponent} services={services} />
        </FormSection>
      </Accordion>
    </ErrorBoundary>
  );
});
