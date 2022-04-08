import React, { useCallback } from 'react';
import {
  VStack,
  HStack,
  Box,
  FormControl,
  FormLabel,
  Switch,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
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

  return (
    <AccordionItem key={i}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Handler {i + 1}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} pt={2} padding={0}>
        <Box pt={2}>
          <EventHandlerForm
            component={api}
            handler={handler}
            spec={eventSpec}
            onChange={onChange}
            onRemove={onRemove}
            services={services}
          />
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const Basic: React.FC<Props> = props => {
  const { formik } = props;

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
      <Accordion allowMultiple>
        {(formik.values[type] ?? []).map((handler, i) => {
          return <Handler key={i} {...props} index={i} handler={handler} type={type} />;
        })}
      </Accordion>
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
      {generateHandlers('onComplete')}
      {generateHandlers('onError')}
    </VStack>
  );
};
