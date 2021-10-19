import { FormControl, FormLabel, Input, Box } from '@chakra-ui/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { Application } from '@meta-ui/core';
import { parseType, parseTypeBox } from '@meta-ui/runtime';
import _ from 'lodash';
import React from 'react';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  ModifyComponentIdOperation,
  ModifyComponentPropertyOperation,
  ModifyTraitPropertyOperation,
} from '../../operations/Operations';
import { TSchema } from '@sinclair/typebox';

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
      eventBus.send(
        'operation',
        type
          ? new ModifyTraitPropertyOperation(
            selectedId,
            type,
            fullKey,
            ref.current?.value
          )
          : new ModifyComponentPropertyOperation(selectedId, fullKey, ref.current?.value)
      );
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
  const properties =  Object.assign(
    parseTypeBox(cImpl.spec.properties as TSchema),
    selectedComponent.properties,
  );
  const fields = Object.keys(properties || []).map(key => {
    const value = properties![key];
    return renderField({ key, value, fullKey: key, selectedId });
  });

  const traitForms = selectedComponent.traits.map(t => {
    const traitForm = Object.keys(t.properties || []).map(key => {
      const value = t.properties[key];
      return renderField({ key, value, fullKey: key, type: t.type, selectedId });
    });

    return (
      <form key={t.type}>
        <strong>{t.type}</strong>
        {traitForm}
      </form>
    );
  });

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
      <div>{traitForms}</div>
    </Box>
  );
};
