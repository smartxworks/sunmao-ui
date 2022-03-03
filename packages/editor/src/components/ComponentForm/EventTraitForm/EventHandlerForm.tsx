import React from 'react';
import {
  Box,
  IconButton,
  VStack,
  EventWidget,
  mergeWidgetOptionsIntoSchema,
} from '@sunmao-ui/editor-sdk';
import { Static } from '@sinclair/typebox';
import { CloseIcon } from '@chakra-ui/icons';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';

type Props = {
  component: ComponentSchema;
  handler: Static<typeof EventHandlerSchema>;
  onChange: (handler: Static<typeof EventHandlerSchema>) => void;
  onRemove: () => void;
  hideEventType?: boolean;
  services: EditorServices;
};

export const EventHandlerForm: React.FC<Props> = props => {
  const { handler, component, onChange, onRemove, hideEventType, services } = props;

  return (
    <Box position="relative" width="100%">
      <VStack className={formWrapperCSS}>
        <EventWidget
          component={component}
          schema={mergeWidgetOptionsIntoSchema(EventHandlerSchema, { hideEventType })}
          value={handler}
          level={1}
          services={services}
          onChange={onChange}
        />
      </VStack>
      <IconButton
        aria-label="remove event handler"
        colorScheme="red"
        icon={<CloseIcon />}
        onClick={onRemove}
        position="absolute"
        right="4"
        size="xs"
        top="4"
        variant="ghost"
      />
    </Box>
  );
};
