import React from 'react';
import { EventWidget } from '@sunmao-ui/editor-sdk';
import { Box, IconButton, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';
import { CloseIcon } from '@chakra-ui/icons';
import { EventHandlerSpec } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';

type Props = {
  component: ComponentSchema;
  handler: Static<typeof EventHandlerSpec>;
  onChange: (handler: Static<typeof EventHandlerSpec>) => void;
  onRemove: () => void;
  services: EditorServices;
  spec?: JSONSchema7;
};

export const EventHandlerForm: React.FC<Props> = props => {
  const { spec = EventHandlerSpec, handler, component, onChange, onRemove, services } = props;

  return (
    <Box position="relative" width="100%">
      <VStack className={formWrapperCSS}>
        <EventWidget
          component={component}
          spec={spec}
          value={handler}
          path={[]}
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
