import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash';
import { CallbackMap, TraitImplementation } from 'src/types/RuntimeSchema';

const useEventTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  events,
  services,
}) => {
  const callbackQueueMap: Record<string, Array<() => void>> = {};

  // setup current handlers
  for (const event of events) {
    const handler = () => {
      let disabled = false;
      if (typeof event.disabled === 'boolean') {
        disabled = event.disabled;
      }
      if (disabled) {
        return;
      }

      services.apiService.send('uiMethod', {
        componentId: event.componentId,
        name: event.method.name,
        parameters: event.method.parameters,
      });
    };
    if (!callbackQueueMap[event.event]) {
      callbackQueueMap[event.event] = [];
    }
    callbackQueueMap[event.event].push(
      event.wait.type === 'debounce'
        ? debounce(handler, event.wait.time)
        : event.wait.type === 'throttle'
          ? throttle(handler, event.wait.time)
          : event.wait.type === 'delay'
            ? () => delay(handler, event.wait.time)
            : handler
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
  events: Type.Array(
    Type.Object({
      event: Type.String(),
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
