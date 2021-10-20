import { AddIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { useMemo } from 'react';
import { ApplicationComponent } from '@meta-ui/core';
import { EventHandlerSchema } from '@meta-ui/runtime';
import { eventBus } from '../../../eventBus';
import { registry } from '../../../metaUI';
import {
  AddTraitOperation,
  ModifyTraitPropertyOperation,
} from '../../../operations/Operations';
import { EventHandlerForm } from './EventHandlerForm';
import produce from 'immer';
import { formWrapperCSS } from '../style';

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  component: ApplicationComponent;
  handlers: EventHandler[];
};

export const EventTraitForm: React.FC<Props> = props => {
  const { component, handlers } = props;

  const eventTypes = useMemo(() => {
    return registry.getComponentByType(component.type).spec.events;
  }, [component]);

  if (!eventTypes.length) return null;
  const onClickAddHandler = () => {
    const newHandler: EventHandler = {
      type: eventTypes[0],
      componentId: '',
      method: {
        name: '',
        parameters: {},
      },
    };

    if (handlers.length === 0) {
      eventBus.send(
        'operation',
        new AddTraitOperation(component.id, 'core/v1/event', { handlers: [newHandler] })
      );
    } else {
      eventBus.send(
        'operation',
        new ModifyTraitPropertyOperation(component.id, 'core/v1/event', 'handlers', [
          ...handlers,
          newHandler,
        ])
      );
    }
  };

  const handlerForms = handlers.map((h, i) => {
    const onChange = (handler: EventHandler) => {
      const newHanlders = produce(handlers, draft => {
        draft[i] = handler;
      });
      eventBus.send(
        'operation',
        new ModifyTraitPropertyOperation(
          component.id,
          'core/v1/event',
          'handlers',
          newHanlders
        )
      );
    };
    return (
      <EventHandlerForm key={i} handler={h} eventTypes={eventTypes} onChange={onChange} />
    );
  });

  return (
    <VStack width="full">
      <HStack width="full" justify="space-between">
        <strong>Events</strong>
        <IconButton
          aria-label="add event"
          size="sm"
          variant="ghost"
          icon={<AddIcon />}
          onClick={onClickAddHandler}
        />
      </HStack>
      <VStack width="full">{handlerForms}</VStack>
    </VStack>
  );
};
