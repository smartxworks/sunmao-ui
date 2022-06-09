import React, { useMemo, useCallback } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Button, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import produce from 'immer';
import { ComponentSchema } from '@sunmao-ui/core';
import { CORE_VERSION, CoreTraitName, EventHandlerSpec } from '@sunmao-ui/shared';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';
import { EventHandlerForm } from './EventHandlerForm';

type EventHandler = Static<typeof EventHandlerSpec>;

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};
type HandlerProps = Props & {
  index: number;
  handlers: EventHandler[];
};

const EVENT_TRAIT_TYPE = `${CORE_VERSION}/${CoreTraitName.Event}`;

const Handler = (props: HandlerProps) => {
  const { handlers, index: i, component, services } = props;
  const { eventBus, registry } = services;

  const handler = useMemo(() => handlers[i], [handlers, i]);

  const onChange = useCallback(
    (handler: EventHandler) => {
      const index = component.traits.findIndex(t => t.type === EVENT_TRAIT_TYPE);
      const newHandlers = produce(handlers!, draft => {
        draft[i] = handler;
      });
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: component.id,
          traitIndex: index,
          properties: {
            handlers: newHandlers,
          },
        })
      );
    },
    [component, handlers, i, registry, eventBus]
  );

  const onRemove = useCallback(() => {
    const index = component.traits.findIndex(t => t.type === EVENT_TRAIT_TYPE);
    const newHandlers = produce(handlers!, draft => {
      draft.splice(i, 1);
    });
    eventBus.send(
      'operation',
      genOperation(registry, 'modifyTraitProperty', {
        componentId: component.id,
        traitIndex: index,
        properties: {
          handlers: newHandlers,
        },
      })
    );
  }, [component, handlers, i, registry, eventBus]);

  const onSort = useCallback(
    (isUp: boolean) => {
      const index = component.traits.findIndex(t => t.type === EVENT_TRAIT_TYPE);
      const newHandlers = [...handlers];
      const switchedIndex = isUp ? i - 1 : i + 1;

      if (newHandlers[switchedIndex]) {
        const temp = newHandlers[switchedIndex];
        newHandlers[switchedIndex] = newHandlers[i];
        newHandlers[i] = temp;

        eventBus.send(
          'operation',
          genOperation(registry, 'modifyTraitProperty', {
            componentId: component.id,
            traitIndex: index,
            properties: {
              handlers: newHandlers,
            },
          })
        );
      }
    },
    [component, handlers, i, registry, eventBus]
  );
  const onUp = useCallback(() => onSort(true), [onSort]);
  const onDown = useCallback(() => onSort(false), [onSort]);

  return (
    <EventHandlerForm
      key={i}
      index={i}
      size={handlers.length}
      component={component}
      services={services}
      handler={handler}
      onUp={onUp}
      onDown={onDown}
      onChange={onChange}
      onRemove={onRemove}
    />
  );
};

export const EventTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const handlers: EventHandler[] = useMemo(() => {
    return component.traits.find(t => t.type === EVENT_TRAIT_TYPE)?.properties
      .handlers as Array<Static<typeof EventHandlerSpec>>;
  }, [component]);

  const eventTypes = useMemo(() => {
    return registry.getComponentByType(component.type).spec.events;
  }, [component.type, registry]);

  const onClickAddHandler = useCallback(() => {
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
        genOperation(registry, 'createTrait', {
          componentId: component.id,
          traitType: EVENT_TRAIT_TYPE,
          properties: { handlers: [newHandler] },
        })
      );
    } else {
      // assume that we only have one event trait
      const index = component.traits.findIndex(t => t.type === EVENT_TRAIT_TYPE);
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: component.id,
          traitIndex: index,
          properties: { handlers: [...handlers, newHandler] },
        })
      );
    }
  }, [component, eventBus, handlers, registry, eventTypes]);

  if (!eventTypes.length) return <span>No events.</span>;

  const handlerForms = () =>
    (handlers || []).map((_, i) => (
      <Handler key={i} {...props} index={i} handlers={handlers} />
    ));

  return (
    <VStack width="full" spacing="2" alignItems="self-start">
      <VStack width="full" spacing="0">
        {handlerForms()}
      </VStack>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        size="sm"
        variant="ghost"
        onClick={onClickAddHandler}
      >
        Add Event
      </Button>
    </VStack>
  );
};
