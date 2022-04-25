import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from '../../../types';
import { genOperation } from '../../../operations';
import { CORE_VERSION, LOCAL_STORAGE_TRAIT_NAME } from '@sunmao-ui/shared';

interface Values {
  key: string;
  value: string;
}
interface Props {
  state: ComponentSchema;
  services: EditorServices;
}

export const LocalStorageForm: React.FC<Props> = props => {
  const { state, services } = props;
  const [name, setName] = useState(state.id);
  const { registry, eventBus, editorStore } = services;
  const traitIndex = state.traits.findIndex(({ type }) => type === `${CORE_VERSION}/${LOCAL_STORAGE_TRAIT_NAME}`);
  const trait = state.traits[traitIndex];
  const formik = useFormik<Values>({
    initialValues: {
      key: 'value',
      value: trait.properties.value as string,
    },
    onSubmit: values => {
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: state.id,
          traitIndex: traitIndex,
          properties: values,
        })
      );
    },
  });
  const { values } = formik;

  const onNameInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      if (value !== state.id) {
        editorStore.changeDataSourceName(state, name);
      }
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  useEffect(() => {
    formik.setValues({
      key: 'value',
      value: (trait.properties.value as string) ?? '',
    });
  }, [trait.properties, state.id]);
  useEffect(() => {
    if (state.id) {
      setName(state.id);
      formik.handleSubmit();
    }
  }, [state.id]);

  return (
    <VStack p="2" spacing="2" background="gray.50" onKeyDown={onKeyDown}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          onBlur={onNameInputBlur}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Value</FormLabel>
        <Input
          name="value"
          value={values.value}
          onChange={formik.handleChange}
          onBlur={() => formik.handleSubmit()}
        />
      </FormControl>
    </VStack>
  );
};
