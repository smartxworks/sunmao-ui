import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash-es';
import { CallbackMap, TraitImplFactory, UIServices } from '../../types';
import { EventHandlerSchema } from '../../types/traitPropertiesSchema';

const PropsSchema = Type.Object({
  handlers: Type.Array(EventHandlerSchema),
});

export const generateCallback = (
  handler: Omit<Static<typeof EventHandlerSchema>, 'type'>,
  rawHandler: Static<typeof EventHandlerSchema>,
  services: UIServices
) => {
  const send = () => {
    // Eval before sending event to assure the handler object is evaled from the latest state.
    const evaledHandler = services.stateManager.deepEval(rawHandler);

    if (evaledHandler.disabled && typeof evaledHandler.disabled === 'boolean') {
      return;
    }

    services.apiService.send('uiMethod', {
      componentId: evaledHandler.componentId,
      name: evaledHandler.method.name,
      parameters: evaledHandler.method.parameters,
    });
  };
  const { wait } = handler;

  if (!wait || !wait.time) {
    return send;
  }

  return wait.type === 'debounce'
    ? debounce(send, wait.time)
    : wait.type === 'throttle'
    ? throttle(send, wait.time)
    : wait.type === 'delay'
    ? () => delay(send, wait!.time)
    : send;
};

const EventTraitFactory: TraitImplFactory<Static<typeof PropsSchema>> = () => {
  return ({ trait, handlers, services }) => {
    const callbackQueueMap: Record<string, Array<() => void>> = {};
    const rawHandlers = trait.properties.handlers as Static<typeof EventHandlerSchema>[];
    // setup current handlers
    for (const i in handlers) {
      const handler = handlers[i];
      if (!callbackQueueMap[handler.type]) {
        callbackQueueMap[handler.type] = [];
      }
      callbackQueueMap[handler.type].push(
        generateCallback(handler, rawHandlers[i], services)
      );
    }

    const callbackMap: CallbackMap<string> = {};

    for (const eventName in callbackQueueMap) {
      callbackMap[eventName] = () => {
        if (!callbackQueueMap[eventName]) {
          // maybe log?
          return;
        }
        callbackQueueMap[eventName].forEach(fn => fn());
      };
    }

    return {
      props: {
        callbackMap,
      },
    };
  };
};

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'event',
      description: 'export component events with advance features',
    },
    spec: {
      properties: PropsSchema,
      methods: [],
      state: {},
    },
  }),
  factory: EventTraitFactory,
};
