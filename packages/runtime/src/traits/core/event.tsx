import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash-es';
import { CallbackMap, TraitImplementation } from '../../types/RuntimeSchema';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';

const useEventTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  handlers,
  services,
}) => {
  const callbackQueueMap: Record<string, Array<() => void>> = {};

  // setup current handlers
  for (const handler of handlers) {
    const cb = () => {
      let disabled = false;
      if (typeof handler.disabled === 'boolean') {
        disabled = handler.disabled;
      }
      if (disabled) {
        return;
      }

      services.apiService.send('uiMethod', {
        componentId: handler.componentId,
        name: handler.method.name,
        parameters: handler.method.parameters,
      });
    };
    if (!callbackQueueMap[handler.type]) {
      callbackQueueMap[handler.type] = [];
    }
    if (!handler.wait) {
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

const PropsSchema = Type.Object({
  handlers: Type.Array(EventHandlerSchema),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'event',
      description: 'export component events with advance features',
    },
    spec: {
      properties: PropsSchema,
    },
  }),
  impl: useEventTrait,
};
