import React from 'react';
import _ from 'lodash';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { Static, TSchema } from '@sinclair/typebox';
import { Application } from '@meta-ui/core';
import { EventHandlerSchema, parseType, parseTypeBox } from '@meta-ui/runtime';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  ModifyComponentIdOperation,
  ModifyComponentPropertyOperation,
  ModifyTraitPropertyOperation,
} from '../../operations/Operations';
import { EventTraitForm } from './EventTraitForm';

type Props = { selectedId: string; app: Application };

const ignoreTraitsList = ['core/v1/slot', 'core/v1/event'];

const renderField = (properties: {
  key: string;
  value: unknown;
  type?: string;
  fullKey: string;
  selectedId: string;
}) => {
  const { value, type, fullKey, selectedId } = properties;
  if (typeof value !== 'object') {
    const ref = React.createRef<HTMLInputElement>();
    const onBlur = () => {
      const operation = type
        ? new ModifyTraitPropertyOperation(selectedId, type, fullKey, ref.current?.value)
        : new ModifyComponentPropertyOperation(selectedId, fullKey, ref.current?.value);
      eventBus.send('operation', operation);
    };
    return (
      <FormControl key={`${selectedId}-${fullKey}`}>
        <FormLabel>{fullKey}</FormLabel>
        <Input ref={ref} onBlur={onBlur} defaultValue={value as string} />
      </FormControl>
    );
  } else {
    const fieldArray: EmotionJSX.Element[] = _.flatten(
      Object.keys(value || []).map(childKey => {
        const childValue = (value as any)[childKey];
        return renderField({
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

const changeCompId = (selectedId: string, value: string) => {
  eventBus.send('operation', new ModifyComponentIdOperation(selectedId, value));
};

export const ComponentForm: React.FC<Props> = props => {
  const { selectedId, app } = props;

  const selectedComponent = app.spec.components.find(c => c.id === selectedId);
  if (!selectedComponent) {
    return <div>cannot find component with id: {selectedId}</div>;
  }
  const { version, name } = parseType(selectedComponent.type);
  const cImpl = registry.getComponent(version, name);
  const properties = Object.assign(
    parseTypeBox(cImpl.spec.properties as TSchema),
    selectedComponent.properties
  );
  const propertyFields = Object.keys(properties || []).map(key => {
    const value = properties![key];
    return renderField({ key, value, fullKey: key, selectedId });
  });

  const traitFields = selectedComponent.traits.map(t => {
    if (ignoreTraitsList.includes(t.type)) return null;
    return Object.keys(t.properties || []).map(key => {
      const value = t.properties[key];
      return renderField({ key, value, fullKey: key, type: t.type, selectedId });
    });
  });

  const eventHandlers = selectedComponent.traits.find(t => t.type === 'core/v1/event')
    ?.properties.handlers as Array<Static<typeof EventHandlerSchema>>;

  const propertyForm = (
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
        {propertyFields}
      </VStack>
    </VStack>
  );

  const traitForm = (
    <VStack width="full" alignItems="start">
      <strong>Trait Fields</strong>
      <VStack
        width="full"
        padding="4"
        background="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="4"
      >
        {traitFields}
      </VStack>
    </VStack>
  );

  return (
    <VStack p={4} spacing="4" background="gray.50">
      <FormControl>
        <FormLabel>
          <strong>Component ID</strong>
        </FormLabel>
        <Input
          key={selectedComponent?.id}
          defaultValue={selectedComponent?.id}
          background="white"
          onBlur={e => changeCompId(selectedComponent?.id, e.target.value)}
        />
      </FormControl>
      {propertyFields.length > 0 ? propertyForm : null}
      <EventTraitForm component={selectedComponent} handlers={eventHandlers} />
      {traitFields.length > 0 ? traitForm : null}
    </VStack>
  );
};
