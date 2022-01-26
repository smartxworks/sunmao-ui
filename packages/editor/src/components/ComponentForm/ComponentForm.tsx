import React, { useState, useEffect } from 'react';
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [textareaValue, setTextareaValue] = useState(value as string);
  const { eventBus, registry } = services;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof value !== 'object') {
      setTextareaValue(value as string);
    }
  }, [value]);

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
    const onChange = (event: any) => {
      setTextareaValue(event.target.value);
    };

    return (
      <FormControl key={`${selectedComponentId}-${fullKey}`}>
        <FormLabel>{fullKey}</FormLabel>
        <Textarea
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={textareaValue}
        />
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
  const { editorStore, registry, eventBus } = services;
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
            />
          </VStack>
        </VStack>
        <EventTraitForm component={selectedComponent} services={services} />
        <FetchTraitForm component={selectedComponent} services={services} />
        <StyleTraitForm component={selectedComponent} services={services} />
        <GeneralTraitFormList component={selectedComponent} services={services} />
      </VStack>
    </ErrorBoundary>
  );
});
