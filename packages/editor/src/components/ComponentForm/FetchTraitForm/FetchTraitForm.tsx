import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import produce from 'immer';
import { ApplicationComponent } from '@meta-ui/core';
import { EventHandlerSchema, FetchTraitPropertiesSchema } from '@meta-ui/runtime';
import { formWrapperCSS } from '../style';
import { KeyValueEditor } from '../../KeyValueEditor';
import { EventHandlerForm } from '../EventTraitForm/EventHandlerForm';
import {
  ModifyTraitPropertiesOperation,
  RemoveTraitOperation,
} from '../../../operations/Operations';
import { eventBus } from '../../../eventBus';
import { Registry } from '@meta-ui/runtime/lib/services/registry';

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  component: ApplicationComponent;
  registry: Registry;
};

const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];

export const FetchTraitForm: React.FC<Props> = props => {
  const { component, registry } = props;

  const fetchTrait = component.traits.find(t => t.type === 'core/v1/fetch')
    ?.properties as Static<typeof FetchTraitPropertiesSchema>;

  if (!fetchTrait) {
    return null;
  }

  const formik = useFormik({
    initialValues: fetchTrait,
    onSubmit: values => {
      eventBus.send(
        'operation',
        new ModifyTraitPropertiesOperation(component.id, 'core/v1/fetch', values)
      );
    },
  });

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
        initValue={formik.values.body}
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
        initValue={formik.values.headers}
        onChange={json => {
          formik.setFieldValue('headers', json);
          formik.submitForm();
        }}
      />
    </FormControl>
  );

  const onAddHandler = () => {
    const newHandler: EventHandler = {
      type: '',
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

    formik.setFieldValue('onComplete', [...formik.values.onComplete, newHandler]);
  };

  const onCompleteField = (
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
          const newOnComplete = produce(formik.values.onComplete, draft => {
            draft[i] = handler;
          });
          formik.setFieldValue('onComplete', newOnComplete);
          formik.submitForm();
        };
        const onRemove = () => {
          const newOnComplete = produce(formik.values.onComplete, draft => {
            draft.splice(i, 1);
          });
          formik.setFieldValue('onComplete', newOnComplete);
          formik.submitForm();
        };
        return (
          <EventHandlerForm
            key={i}
            eventTypes={[]}
            handler={handler}
            hideEventType={true}
            onChange={onChange}
            onRemove={onRemove}
            registry={registry}
          />
        );
      })}
    </FormControl>
  );

  return (
    <Box width="full" position="relative">
      <strong>Fetch</strong>
      <HStack width="full" justify="space-between">
        <VStack css={formWrapperCSS}>
          {urlField}
          {methodField}
          {bodyField}
          {headersField}
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
          const i = component.traits.findIndex(t => t.type === 'core/v1/fetch');
          eventBus.send('operation', new RemoveTraitOperation(component.id, i));
        }}
      />
    </Box>
  );
};
