import React, { useMemo } from 'react';
import { flatten } from 'lodash-es';
import { FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { TSchema } from '@sinclair/typebox';
import { Application } from '@sunmao-ui/core';
import { parseType, parseTypeBox } from '@sunmao-ui/runtime';
import { eventBus } from '../../eventBus';
import { EventTraitForm } from './EventTraitForm';
import { GeneralTraitFormList } from './GeneralTraitFormList';
import { FetchTraitForm } from './FetchTraitForm';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import SchemaField from './JsonSchemaForm/SchemaField';
import { genOperation } from 'src/operations';

type Props = {
  registry: Registry;
  selectedId: string;
  app: Application;
};

export const renderField = (properties: {
  key: string;
  value: unknown;
  type?: string;
  fullKey: string;
  selectedId: string;
  index: number;
}) => {
  const { value, type, fullKey, selectedId, index } = properties;
  if (typeof value !== 'object') {
    const ref = React.createRef<HTMLTextAreaElement>();
    const onBlur = () => {
      const operation = type
        ? genOperation('modifyTraitProperty', {
            componentId: selectedId,
            traitIndex: index,
            properties: {
              [fullKey]: ref.current?.value,
            },
          })
        : genOperation('modifyComponentProperty', {
            componentId: selectedId,
            properties: {
              [fullKey]: ref.current?.value,
            },
          });
      eventBus.send('operation', operation);
    };
    return (
      <FormControl key={`${selectedId}-${fullKey}`}>
        <FormLabel>{fullKey}</FormLabel>
        <Textarea ref={ref} onBlur={onBlur} defaultValue={value as string} />
      </FormControl>
    );
  } else {
    const fieldArray: EmotionJSX.Element[] = flatten(
      Object.keys(value || []).map((childKey, index) => {
        const childValue = (value as any)[childKey];
        return renderField({
          index,
          key: childKey,
          value: childValue,
          type: type,
          fullKey: `${fullKey}.${childKey}`,
          selectedId,
        });
      })
    );
    return fieldArray;
  }
};

export const ComponentForm: React.FC<Props> = props => {
  const { selectedId, app, registry } = props;

  const selectedComponent = useMemo(
    () => app.spec.components.find(c => c.id === selectedId),
    [selectedId, app]
  );

  if (!selectedComponent) {
    return <div>cannot find component with id: {selectedId}</div>;
  }
  const { version, name } = parseType(selectedComponent.type);
  const cImpl = registry.getComponent(version, name);
  const properties = Object.assign(
    parseTypeBox(cImpl.spec.properties as TSchema),
    selectedComponent.properties
  );

  const changeComponentId = (selectedId: string, value: string) => {
    eventBus.send(
      'operation',
      genOperation('modifyComponentId', {
        componentId: selectedId,
        newId: value,
      })
    );
  };

  return !selectedComponent ? (
    <div>cannot find component with id: {selectedId}</div>
  ) : (
    <VStack p={4} spacing="4" background="gray.50">
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
          padding="4"
          background="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="4"
        >
          <SchemaField
            schema={cImpl.spec.properties}
            label=""
            formData={properties}
            onChange={newFormData => {
              eventBus.send(
                'operation',
                genOperation('modifyComponentProperty', {
                  componentId: selectedId,
                  properties: newFormData,
                })
              );
            }}
          />
        </VStack>
      </VStack>
      <EventTraitForm
        component={selectedComponent}
        registry={registry}
      />
      <FetchTraitForm
        component={selectedComponent}
        registry={registry}
      />
      <GeneralTraitFormList component={selectedComponent} registry={registry} />
    </VStack>
  );
};
