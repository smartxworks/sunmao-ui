import React from 'react';
import _ from 'lodash';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { FormControl, FormLabel, Input, Box } from '@chakra-ui/react';
import { TSchema } from '@sinclair/typebox';
import { Application } from '@meta-ui/core';
import { parseType, parseTypeBox } from '@meta-ui/runtime';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  ModifyComponentIdOperation,
  ModifyComponentPropertyOperation,
  ModifyTraitPropertyOperation,
} from '../../operations/Operations';
import { EventTraitForm } from './EventTraitForm';

type Props = { selectedId: string; app: Application };

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
  const fields = Object.keys(properties || []).map(key => {
    const value = properties![key];
    return renderField({ key, value, fullKey: key, selectedId });
  });

  const traitForms = selectedComponent.traits.map(t => {
    return Object.keys(t.properties || []).map(key => {
      const value = t.properties[key];
      return renderField({ key, value, fullKey: key, type: t.type, selectedId });
    });
  });

  const eventHandlers =
    selectedComponent.traits.find(t => t.type === 'core/v1/event')?.properties.handlers ||
    ([] as any);

  return (
    <Box p={4}>
      <div>Component Form</div>
      <div>
        ID:
        <Input
          key={selectedComponent?.id}
          defaultValue={selectedComponent?.id}
          onBlur={e => changeCompId(selectedComponent?.id, e.target.value)}
        />
      </div>
      <form>{fields}</form>
      <strong>Trait Fields</strong>
      <EventTraitForm component={selectedComponent} handlers={eventHandlers} />
      <div>{traitForms}</div>
    </Box>
  );
};
