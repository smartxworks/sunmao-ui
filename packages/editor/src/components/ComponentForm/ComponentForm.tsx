import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Application } from '@meta-ui/core';
import React from 'react';
import { parseType } from '../../../../runtime/lib';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  ModifyComponentPropertyOperation,
  ModifyTraitPropertyOperation,
} from '../../operations/Operations';

type Props = { selectedId: string; app: Application };

export const ComponentForm: React.FC<Props> = props => {
  const { selectedId, app } = props;

  const selectedComponent = app.spec.components.find(c => c.id === selectedId);

  if (!selectedComponent) {
    return <div>cannot find component with id: {selectedId}</div>;
  }

  const properties = selectedComponent.properties;

  const { name, version } = parseType(selectedComponent.type);
  const spec = registry.getComponent(version, name).spec;

  const fields = Object.keys(properties || []).map(key => {
    const value = properties![key];
    const ref = React.createRef<HTMLInputElement>();
    const onBlur = () => {
      eventBus.send(
        'operation',
        new ModifyComponentPropertyOperation(selectedId, key, ref.current?.value)
      );
    };
    return (
      <FormControl key={key}>
        <FormLabel>{key}</FormLabel>
        <Input ref={ref} onBlur={onBlur} defaultValue={value as string} />
      </FormControl>
    );
  });

  const traitForms = selectedComponent.traits.map(t => {
    const traitForm = Object.keys(t.properties || []).map(key => {
      const value = t.properties[key];
      const ref = React.createRef<HTMLInputElement>();
      const onBlur = () => {
        eventBus.send(
          'operation',
          new ModifyTraitPropertyOperation(selectedId, t.type, key, ref.current?.value)
        );
      };
      return (
        <FormControl key={key}>
          <FormLabel>{key}</FormLabel>
          <Input ref={ref} onBlur={onBlur} defaultValue={value as string} />
        </FormControl>
      );
    });

    return (
      <form key={t.type}>
        <strong>{t.type}</strong>
        {traitForm}
      </form>
    );
  });

  return (
    <div>
      <strong>Component Fields</strong>
      <div>ID: {selectedComponent?.id}</div>
      <form>{fields}</form>
      <strong>Trait Fields</strong>
      <div>{traitForms}</div>
    </div>
  );
};
