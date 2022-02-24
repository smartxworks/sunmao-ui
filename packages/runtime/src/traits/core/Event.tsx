import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash-es';
import { CallbackMap, TraitImpl } from '../../types';
import { EventHandlerSchema } from '../../types/traitPropertiesSchema';

const PropsSchema = Type.Object({
  handlers: Type.Array(EventHandlerSchema),
});

const useEventTrait: TraitImpl<Static<typeof PropsSchema>> = ({
  trait,
  handlers,
  services,
}) => {
  const callbackQueueMap: Record<string, Array<() => void>> = {};
  // setup current handlers
  for (const i in handlers) {
    const handler = handlers[i];
    const cb = () => {
      const rawHandlers = trait.properties.handlers as Static<typeof EventHandlerSchema>[];
      // Eval before sending event to assure the handler object is evaled from the latest state.
      const evaledHandler = services.stateManager.deepEval(rawHandlers[i]);

      if (evaledHandler.disabled && typeof evaledHandler.disabled === 'boolean') {
        return;
      }

      services.apiService.send('uiMethod', {
        componentId: evaledHandler.componentId,
        name: evaledHandler.method.name,
        parameters: evaledHandler.method.parameters,
      });
    };
    if (!callbackQueueMap[handler.type]) {
      callbackQueueMap[handler.type] = [];
    }
    if (!handler.wait || !handler.wait.time) {
      callbackQueueMap[handler.type].push(cb);
    } else {
      callbackQueueMap[handler.type].push(
        handler.wait.type === 'debounce'
          ? debounce(cb, handler.wait.time)
          : handler.wait.type === 'throttle'
          ? throttle(cb, handler.wait.time)
          : handler.wait.type === 'delay'
          ? () => delay(cb, handler.wait!.time)
          : cb
      );
    }
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
  impl: useEventTrait,
};
