import { useMemo } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import produce from 'immer';
import { ApplicationComponent } from '@meta-ui/core';
import { EventHandlerSchema } from '@meta-ui/runtime';
import { eventBus } from '../../../eventBus';
import {
  AddTraitOperation,
  ModifyTraitPropertyOperation,
} from '../../../operations/Operations';
import { EventHandlerForm } from './EventHandlerForm';
import { Registry } from '@meta-ui/runtime/lib/services/registry';

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  registry: Registry;
  component: ApplicationComponent;
};

export const EventTraitForm: React.FC<Props> = props => {
  const { component, registry } = props;

  const handlers: EventHandler[] = useMemo(() => {
    return component.traits.find(t => t.type === 'core/v1/event')?.properties
      .handlers as Array<Static<typeof EventHandlerSchema>>;
  }, [component]);

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
      disabled: false,
      wait: {
        type: 'delay',
        time: 0,
      },
    };

    if (!handlers) {
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

  const handlerForms = () =>
    (handlers || []).map((h, i) => {
      const onChange = (handler: EventHandler) => {
        const newHanlders = produce(handlers!, draft => {
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

      const onRemove = () => {
        const newHanlders = produce(handlers!, draft => {
          draft.splice(i, 1);
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
        <EventHandlerForm
          key={i}
          handler={h}
          eventTypes={eventTypes}
          onChange={onChange}
          onRemove={onRemove}
          registry={registry}
        />
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
          colorScheme="blue"
          icon={<AddIcon />}
          onClick={onClickAddHandler}
        />
      </HStack>
      <VStack width="full">{handlerForms}</VStack>
    </VStack>
  );
};
