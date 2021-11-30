import { useMemo } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import produce from 'immer';
import { ApplicationComponent } from '@sunmao-ui/core';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { eventBus } from '../../../eventBus';
import { EventHandlerForm } from './EventHandlerForm';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { AppModelManager } from '../../../operations/AppModelManager';
import {
  CreateTraitLeafOperation,
  ModifyTraitPropertiesLeafOperation,
} from '../../../operations/leaf';

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  registry: Registry;
  component: ApplicationComponent;
  appModelManager: AppModelManager
};

export const EventTraitForm: React.FC<Props> = props => {
  const { component, registry, appModelManager } = props;

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
        new CreateTraitLeafOperation({
          componentId: component.id,
          traitType: 'core/v1/event',
          properties: { handlers: [newHandler] },
        })
      );
    } else {
      // assume that we only have one event trait
      const index = component.traits.findIndex(t => t.type === 'core/v1/event');
      eventBus.send(
        'operation',
        new ModifyTraitPropertiesLeafOperation({
          componentId: component.id,
          traitIndex: index,
          properties: [...handlers, newHandler],
        })
      );
    }
  };

  const handlerForms = () =>
    (handlers || []).map((h, i) => {
      const onChange = (handler: EventHandler) => {
        const index = component.traits.findIndex(t => t.type === 'core/v1/event');
        const newHanlders = produce(handlers!, draft => {
          draft[i] = handler;
        });
        eventBus.send(
          'operation',
          new ModifyTraitPropertiesLeafOperation({
            componentId: component.id,
            traitIndex: index,
            properties: {
              handlers: newHanlders,
            },
          })
        );
      };

      const onRemove = () => {
        const index = component.traits.findIndex(t => t.type === 'core/v1/event');
        const newHanlders = produce(handlers!, draft => {
          draft.splice(i, 1);
        });
        eventBus.send(
          'operation',
          new ModifyTraitPropertiesLeafOperation({
            componentId: component.id,
            traitIndex: index,
            properties: {
              handlers: newHanlders,
            },
          })
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
          appModelManager={appModelManager}
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
      <VStack width="full">{handlerForms()}</VStack>
    </VStack>
  );
};
