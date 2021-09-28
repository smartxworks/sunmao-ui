import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Application } from '@meta-ui/core';
import React from 'react';
import { eventBus } from '../../eventBus';
import { ModifyComponentPropertyOperation } from '../../operations/Operations';

type Props = { selectedId: string; app: Application };

export const ComponentForm: React.FC<Props> = props => {
  const { selectedId, app } = props;

  const selectedComponent = app.spec.components.find(c => c.id === selectedId);

  const properties = selectedComponent?.properties;

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

  return (
    <div>
      <div>选中{selectedComponent?.id}</div>
      <form>{fields}</form>
    </div>
  );
};
