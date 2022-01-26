import React from 'react';
import { flatten } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import { TSchema } from '@sinclair/typebox';
import { parseType } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/runtime';

import { EventTraitForm } from './EventTraitForm';
import { GeneralTraitFormList } from './GeneralTraitFormList';
import { FetchTraitForm } from './FetchTraitForm';
import SchemaField from './JsonSchemaForm/SchemaField';
import { genOperation } from '../../operations';
import ErrorBoundary from '../ErrorBoundary';
import { StyleTraitForm } from './StyleTraitForm';
import { EditorServices } from '../../types';

type Props = {
  services: EditorServices;
};

export const renderField = (properties: {
  key: string;
  value: unknown;
  type?: string;
  fullKey: string;
  selectedComponentId: string;
  index: number;
  services: EditorServices;
}) => {
  const { value, type, fullKey, selectedComponentId, index, services } = properties;
  const { eventBus, registry } = services;
  if (typeof value !== 'object') {
    const ref = React.createRef<HTMLTextAreaElement>();
    const onBlur = () => {
      const operation = type
        ? genOperation(registry, 'modifyTraitProperty', {
            componentId: selectedComponentId,
            traitIndex: index,
            properties: {
              [fullKey]: ref.current?.value,
            },
          })
        : genOperation(registry, 'modifyComponentProperty', {
            componentId: selectedComponentId,
            properties: {
              [fullKey]: ref.current?.value,
            },
          });
      eventBus.send('operation', operation);
    };
    return (
      <FormControl key={`${selectedComponentId}-${fullKey}`}>
        <FormLabel>{fullKey}</FormLabel>
        <Textarea ref={ref} onBlur={onBlur} defaultValue={value as string} />
      </FormControl>
    );
  } else {
    const fieldArray: React.ReactElement[] = flatten(
      Object.keys(value || []).map((childKey, index) => {
        const childValue = (value as any)[childKey];
        return renderField({
          index,
          key: childKey,
          value: childValue,
          type: type,
          fullKey: `${fullKey}.${childKey}`,
          selectedComponentId,
          services,
        });
      })
    );
    return fieldArray;
  }
};

export const ComponentForm: React.FC<Props> = observer(props => {
  const { services } = props;
  const { editorStore, registry, eventBus, stateManager } = services;
  const { selectedComponent, selectedComponentId } = editorStore;
  if (!selectedComponentId) {
    return <div>No components selected. Click on a component to select it.</div>;
  }

  if (!selectedComponent) {
    return <div>Cannot find component with id: {selectedComponentId}.</div>;
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
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  const hasFetchTrait = !!selectedComponent.traits.find(t => t.type === 'core/v1/fetch');

  return (
    <ErrorBoundary>
      <VStack p="2" spacing="2" background="gray.50" onKeyDown={onKeyDown}>
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
          <VStack
            width="full"
            padding="2"
            background="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="4"
          >
            <SchemaField
              schema={cImpl.spec.properties}
              label=""
              key={selectedComponent.id}
              formData={properties}
              onChange={newFormData => {
                eventBus.send(
                  'operation',
                  genOperation(registry, 'modifyComponentProperty', {
                    componentId: selectedComponentId,
                    properties: newFormData,
                  })
                );
              }}
              registry={registry}
              stateManager={stateManager}
            />
          </VStack>
        </VStack>
        <EventTraitForm component={selectedComponent} services={services} />
        { hasFetchTrait ? <FetchTraitForm component={selectedComponent} services={services} /> : null }
        <StyleTraitForm component={selectedComponent} services={services} />
        <GeneralTraitFormList component={selectedComponent} services={services} />
      </VStack>
    </ErrorBoundary>
  );
});
