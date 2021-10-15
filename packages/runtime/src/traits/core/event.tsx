import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash';
import { CallbackMap, TraitImplementation } from 'src/types/RuntimeSchema';

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
    callbackQueueMap[handler.type].push(
      handler.wait.type === 'debounce'
        ? debounce(cb, handler.wait.time)
        : handler.wait.type === 'throttle'
          ? throttle(cb, handler.wait.time)
          : handler.wait.type === 'delay'
            ? () => delay(cb, handler.wait.time)
            : cb
    );
  }

  const callbackMap: CallbackMap = {};

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
  handlers: Type.Array(
    Type.Object({
      type: Type.String(),
      componentId: Type.String(),
      method: Type.Object({
        name: Type.String(),
        parameters: Type.Any(),
      }),
      wait: Type.Object({
        type: Type.KeyOf(
          Type.Object({
            debounce: Type.String(),
            throttle: Type.String(),
            delay: Type.String(),
          })
        ),
        time: Type.Number(),
      }),
      disabled: Type.Boolean(),
    })
  ),
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
      state: {},
      methods: [],
    },
  }),
  impl: useEventTrait,
};
