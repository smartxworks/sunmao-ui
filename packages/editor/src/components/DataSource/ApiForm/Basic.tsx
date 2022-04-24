import React, { useCallback } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Switch,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { EventHandlerForm } from '../../ComponentForm/EventTraitForm/EventHandlerForm';
import {
  FetchTraitPropertiesSpec,
  EventCallBackHandlerSpec,
  BaseEventSpec,
} from '@sunmao-ui/runtime';
import { Static, Type } from '@sinclair/typebox';
import { EditorServices } from '../../../types';
import { ComponentSchema } from '@sunmao-ui/core';
import { SpecWidget } from '@sunmao-ui/editor-sdk';

type Values = Static<typeof FetchTraitPropertiesSpec>;
type EventHandler = Static<typeof EventCallBackHandlerSpec>;
type HandlerType = 'onComplete' | 'onError';
interface Props {
  api: ComponentSchema;
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

type HandlerProps = Props & {
  index: number;
  handler: EventHandler;
  type: HandlerType;
};

const eventSpec = Type.Object(BaseEventSpec);

const Handler = (props: HandlerProps) => {
  const { index: i, handler, type, api, formik, services } = props;
  const onChange = useCallback(
    (handler: EventHandler) => {
      const newOnComplete = formik.values[type].map((onComplete, index) =>
        index === i ? handler : onComplete
      );
      formik.setFieldValue(type, newOnComplete);
      formik.submitForm();
    },
    [i, type, formik]
  );
  const onRemove = useCallback(() => {
    const newOnComplete = formik.values[type].filter((_, index) => i !== index);
    formik.setFieldValue(type, newOnComplete);
    formik.submitForm();
  }, [i, type, formik]);
  const onSort = useCallback(
    (isUp: boolean) => {
      const newHandlers = [...formik.values[type]];
      const switchedIndex = isUp ? i - 1 : i + 1;

      if (newHandlers[switchedIndex]) {
        const temp = newHandlers[switchedIndex];
        newHandlers[switchedIndex] = newHandlers[i];
        newHandlers[i] = temp;

        formik.setFieldValue(type, newHandlers);
        formik.submitForm();
      }
    },
    [i, type, formik]
  );
  const onUp = useCallback(() => {
    onSort(true);
  }, [onSort]);
  const onDown = useCallback(() => {
    onSort(false);
  }, [onSort]);

  return (
    <EventHandlerForm
      key={i}
      index={i}
      size={(formik.values[type] ?? []).length}
      component={api}
      handler={handler}
      spec={eventSpec}
      onChange={onChange}
      onRemove={onRemove}
      onUp={onUp}
      onDown={onDown}
      services={services}
    />
  );
};

const DisabledSpec = Type.Boolean({
  widgetOptions: { isShowAsideExpressionButton: true },
});

const EmptyArray: string[] = [];

export const Basic: React.FC<Props> = props => {
  const { formik, api, services } = props;

  const onAddHandler = (type: HandlerType) => {
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

    formik.setFieldValue(type, [...(formik.values[type] || []), newHandler]);
  };

  const onDisabledChange = useCallback(
    val => {
      formik.setFieldValue('disabled', val);
      formik.handleSubmit();
    },
    [formik]
  );

  const generateHandlers = (type: HandlerType) => (
    <FormControl>
      <HStack width="full" alignItems="center" mb={0}>
        <FormLabel margin={0}>{type}</FormLabel>
        <IconButton
          aria-label="add event"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          icon={<AddIcon />}
          onClick={() => onAddHandler(type)}
        />
      </HStack>
      {(formik.values[type] ?? []).map((handler, i) => {
        return <Handler key={i} {...props} index={i} handler={handler} type={type} />;
      })}
    </FormControl>
  );

  return (
    <VStack spacing="5" alignItems="stretch">
      <FormControl display="flex" alignItems="center">
        <FormLabel margin="0" marginRight="2">
          Lazy
        </FormLabel>
        <Switch
          name="lazy"
          isChecked={formik.values.lazy}
          onChange={formik.handleChange}
          onBlur={() => formik.handleSubmit()}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel margin="0" marginRight="2">
          Disabled
        </FormLabel>
        <SpecWidget
          component={api}
          spec={DisabledSpec}
          value={formik.values.disabled}
          path={EmptyArray}
          level={1}
          services={services}
          onChange={onDisabledChange}
        />
      </FormControl>
      {generateHandlers('onComplete')}
      {generateHandlers('onError')}
    </VStack>
  );
};
