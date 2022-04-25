import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash-es';
import { CallbackMap, UIServices } from '../../types';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { EventHandlerSpec, CORE_VERSION, EVENT_TRAIT_NAME } from '@sunmao-ui/shared';

export const EventTraitPropertiesSpec = Type.Object({
  handlers: Type.Array(EventHandlerSpec),
});

export const generateCallback = (
  handler: Omit<Static<typeof EventHandlerSpec>, 'type'>,
  rawHandler: Static<typeof EventHandlerSpec>,
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

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: EVENT_TRAIT_NAME,
    description: 'export component events with advance features',
  },
  spec: {
    properties: EventTraitPropertiesSpec,
    methods: [],
    state: {},
  },
})(() => {
  return ({ trait, handlers, services }) => {
    const callbackQueueMap: Record<string, Array<() => void>> = {};
    const rawHandlers = trait.properties.handlers as Static<typeof EventHandlerSpec>[];
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
});
