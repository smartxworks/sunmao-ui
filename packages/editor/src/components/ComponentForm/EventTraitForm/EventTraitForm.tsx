import React, { useMemo, useCallback } from 'react';
import { VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { ComponentSchema } from '@sunmao-ui/core';
import {
  CORE_VERSION,
  CoreTraitName,
  EventHandlerSpec,
  MountEvents,
} from '@sunmao-ui/shared';
import { ArrayField, mergeWidgetOptionsIntoSpec } from '@sunmao-ui/editor-sdk';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';

type EventHandler = Static<typeof EventHandlerSpec>;

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

const EVENT_TRAIT_TYPE = `${CORE_VERSION}/${CoreTraitName.Event}`;

export const EventTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const spec = registry.getTraitByType(EVENT_TRAIT_TYPE);
  const handlers: EventHandler[] = useMemo(() => {
    return component.traits.find(t => t.type === EVENT_TRAIT_TYPE)?.properties
      .handlers as Array<Static<typeof EventHandlerSpec>>;
  }, [component]);

  const eventTypes = useMemo(() => {
    return [...registry.getComponentByType(component.type).spec.events, ...MountEvents];
  }, [component.type, registry]);

  const onChange = useCallback(
    (newHandlers: EventHandler[]) => {
      if (handlers) {
        const index = component.traits.findIndex(t => t.type === EVENT_TRAIT_TYPE);

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
      } else {
        eventBus.send(
          'operation',
          genOperation(registry, 'createTrait', {
            componentId: component.id,
            traitType: EVENT_TRAIT_TYPE,
            properties: { handlers: newHandlers },
          })
        );
      }
    },
    [component, handlers, registry, eventBus]
  );

  if (!eventTypes.length) return <span>No events.</span>;

  return (
    <VStack width="full" spacing="2" alignItems="self-start">
      <VStack width="full" spacing="0">
        <ArrayField
          component={component}
          services={services}
          spec={mergeWidgetOptionsIntoSpec<'core/v1/array'>(
            spec.spec.properties.properties!.handlers as any,
            {
              displayedKeys: ['componentId', 'type'],
            }
          )}
          value={handlers || []}
          level={1}
          path={[]}
          onChange={onChange}
        />
      </VStack>
    </VStack>
  );
};
