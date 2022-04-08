import React from 'react';
import { EventWidget } from '@sunmao-ui/editor-sdk';
import {
  Box,
  IconButton,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';
import { CloseIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { EventHandlerSpec } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';

type Props = {
  index: number;
  size: number;
  component: ComponentSchema;
  handler: Static<typeof EventHandlerSpec>;
  onChange: (handler: Static<typeof EventHandlerSpec>) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  services: EditorServices;
  spec?: JSONSchema7;
};

export const EventHandlerForm: React.FC<Props> = props => {
  const {
    index,
    size,
    spec = EventHandlerSpec,
    handler,
    component,
    services,
    onChange,
    onRemove,
    onUp,
    onDown,
  } = props;

  return (
    <Accordion width="100%" allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Handler {index + 1}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} pt={2} padding={0}>
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
            <Box position="absolute" right="4" top="4">
              <IconButton
                aria-label="up event handler"
                icon={<ArrowUpIcon />}
                size="xs"
                variant="ghost"
                disabled={index === 0}
                onClick={onUp}
            />
              <IconButton
                aria-label="down event handler"
                icon={<ArrowDownIcon />}
                size="xs"
                variant="ghost"
                disabled={index === size - 1}
                onClick={onDown}
            />
              <IconButton
                aria-label="remove event handler"
                colorScheme="red"
                icon={<CloseIcon />}
                onClick={onRemove}
                size="xs"
                variant="ghost"
            />
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
