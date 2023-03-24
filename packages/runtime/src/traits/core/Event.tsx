import { Type } from '@sinclair/typebox';
import { CallbackMap } from '../../types';
import { implementRuntimeTrait } from '../../utils/buildKit';
import {
  EventHandlerSpec,
  CORE_VERSION,
  CoreTraitName,
  MountEvent,
} from '@sunmao-ui/shared';
import { runEventHandler } from '../../utils/runEventHandler';

const HandlersSpec = Type.Array(EventHandlerSpec);
export const EventTraitPropertiesSpec = Type.Object({
  handlers: HandlersSpec,
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Event,
    description: 'export component events with advance features',
  },
  spec: {
    properties: EventTraitPropertiesSpec,
    methods: [],
    state: {},
  },
})(() => {
  return ({ trait, handlers, services, slotKey, componentId }) => {
    const callbackQueueMap: Record<string, Array<() => void>> = {};
    const rawHandlers = trait.properties.handlers;
    // setup current handlers
    for (const i in handlers) {
      const handler = handlers[i];

      if (!callbackQueueMap[handler.type]) {
        callbackQueueMap[handler.type] = [];
      }
      callbackQueueMap[handler.type].push(
        runEventHandler(handler, rawHandlers, Number(i), services, slotKey, componentId)
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
        componentDidMount: [
          () => {
            handlers.forEach((h, i) => {
              if (h.type === MountEvent.mount) {
                runEventHandler(h, rawHandlers, i, services, slotKey, componentId)();
              }
            });
          },
        ],
        componentDidUpdate: [
          () => {
            handlers.forEach((h, i) => {
              if (h.type === MountEvent.update) {
                runEventHandler(h, rawHandlers, i, services, slotKey, componentId)();
              }
            });
          },
        ],
        componentDidUnmount: [
          () => {
            handlers.forEach((h, i) => {
              if (h.type === MountEvent.unmount) {
                runEventHandler(h, rawHandlers, i, services, slotKey, componentId)();
              }
            });
          },
        ],
      },
    };
  };
});
