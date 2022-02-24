import React from 'react';
import { useFormik } from 'formik';
import produce from 'immer';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { ComponentSchema } from '@sunmao-ui/core';
import {
  EventCallBackHandlerSchema,
  FetchTraitPropertiesSchema,
} from '@sunmao-ui/runtime';
import { formWrapperCSS } from '../style';
import { KeyValueEditor } from '../../KeyValueEditor';
import { EventHandlerForm } from '../EventTraitForm/EventHandlerForm';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';

type EventHandler = Static<typeof EventCallBackHandlerSchema>;

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];

export const FetchTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { registry, eventBus, stateManager } = services;

  const fetchTrait = component.traits.find(t => t.type === 'core/v1/fetch')
    ?.properties as Static<typeof FetchTraitPropertiesSchema>;

  const formik = useFormik({
    initialValues: { ...fetchTrait },
    onSubmit: values => {
      const index = component.traits.findIndex(t => t.type === 'core/v1/fetch');
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: component.id,
          traitIndex: index,
          properties: values,
        })
      );
    },
  });

  if (!fetchTrait) {
    return null;
  }

  const urlField = (
    <FormControl>
      <FormLabel>URL</FormLabel>
      <Input
        name="url"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.url}
      />
    </FormControl>
  );

  const methodField = (
    <FormControl>
      <FormLabel>Method</FormLabel>
      <Select
        name="method"
        placeholder="Select Method"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.method}
      >
        {httpMethods.map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </Select>
    </FormControl>
  );
  const bodyField = (
    <FormControl>
      <FormLabel>Body</FormLabel>
      <KeyValueEditor
        registry={registry}
        stateManager={stateManager}
        value={formik.values.body}
        onChange={json => {
          formik.setFieldValue('body', json);
          formik.submitForm();
        }}
      />
    </FormControl>
  );

  const headersField = (
    <FormControl>
      <FormLabel>Headers</FormLabel>
      <KeyValueEditor
        registry={registry}
        stateManager={stateManager}
        value={formik.values.headers}
        onChange={json => {
          formik.setFieldValue('headers', json);
          formik.submitForm();
        }}
      />
    </FormControl>
  );

  const lazyField = (
    <FormControl>
      <FormLabel>Lazy</FormLabel>
      <Switch
        name="lazy"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        isChecked={formik.values.lazy}
      />
    </FormControl>
  );

  const onAddHandler = () => {
    const newHandler: EventHandler = {
      componentId: '',
      method: {
        name: '',
        parameters: {},
      },
      disabled: false,
      wait: {
        type: 'delay',
        time: 0,
      },
    };

    formik.setFieldValue('onComplete', [...(formik.values.onComplete || []), newHandler]);
  };

  const onCompleteField = formik.values.onComplete ? (
    <FormControl>
      <HStack width="full" justify="space-between">
        <FormLabel>onComplete</FormLabel>

        <IconButton
          aria-label="add event"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          icon={<AddIcon />}
          onClick={onAddHandler}
        />
      </HStack>
      {formik.values.onComplete.map((handler, i) => {
        const onChange = (handler: EventHandler) => {
          const newOnComplete = produce(formik.values.onComplete || [], draft => {
            draft[i] = handler;
          });
          formik.setFieldValue('onComplete', newOnComplete);
          formik.submitForm();
        };
        const onRemove = () => {
          const newOnComplete = produce(formik.values.onComplete || [], draft => {
            draft.splice(i, 1);
          });
          formik.setFieldValue('onComplete', newOnComplete);
          formik.submitForm();
        };
        return (
          <EventHandlerForm
            key={i}
            eventTypes={[]}
            handler={{ type: '', ...handler }}
            hideEventType={true}
            onChange={onChange}
            onRemove={onRemove}
            services={services}
          />
        );
      })}
    </FormControl>
  ) : null;

  return (
    <Box width="full" position="relative">
      <strong>Fetch</strong>
      <HStack width="full" justify="space-between">
        <VStack className={formWrapperCSS}>
          {urlField}
          {methodField}
          {bodyField}
          {headersField}
          {lazyField}
          {onCompleteField}
        </VStack>
      </HStack>
      <IconButton
        position="absolute"
        right="0"
        top="0"
        aria-label="remove event handler"
        variant="ghost"
        colorScheme="red"
        size="xs"
        icon={<CloseIcon />}
        onClick={() => {
          const index = component.traits.findIndex(t => t.type === 'core/v1/fetch');
          eventBus.send(
            'operation',
            genOperation(registry, 'removeTrait', {
              componentId: component.id,
              index,
            })
          );
        }}
      />
    </Box>
  );
};
