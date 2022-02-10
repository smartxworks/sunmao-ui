import React from 'react';
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
  FetchTraitPropertiesSchema,
  EventCallBackHandlerSchema,
} from '@sunmao-ui/runtime';
import { Static } from '@sinclair/typebox';
import { EditorServices } from '../../../types';
import produce from 'immer';

type Values = Static<typeof FetchTraitPropertiesSchema>;
type EventHandler = Static<typeof EventCallBackHandlerSchema>;
type HandlerType = 'onComplete' | 'onError';
interface Props {
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

export const Basic: React.FC<Props> = props => {
  const { formik, services } = props;

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
          const onChange = (handler: EventHandler) => {
            const newOnComplete = produce(formik.values[type] || [], draft => {
              draft[i] = handler;
            });
            formik.setFieldValue(type, newOnComplete);
            formik.submitForm();
          };
          const onRemove = () => {
            const newOnComplete = produce(formik.values[type] || [], draft => {
              draft.splice(i, 1);
            });
            formik.setFieldValue(type, newOnComplete);
            formik.submitForm();
          };

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
                    eventTypes={[]}
                    handler={{ type: '', ...handler }}
                    hideEventType={true}
                    onChange={onChange}
                    onRemove={onRemove}
                    services={services}
                  />
                </Box>
              </AccordionPanel>
            </AccordionItem>
          );
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
