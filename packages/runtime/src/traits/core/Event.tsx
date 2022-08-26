import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash';
import { CallbackMap, UIServices } from '../../types';
import { implementRuntimeTrait } from '../../utils/buildKit';
import {
  EventHandlerSpec,
  EventCallBackHandlerSpec,
  CORE_VERSION,
  CoreTraitName,
} from '@sunmao-ui/shared';
import { type PropsBeforeEvaled } from '@sunmao-ui/core';

const HandlersSpec = Type.Array(EventHandlerSpec);
const CallbackSpec = Type.Array(EventCallBackHandlerSpec);
export const EventTraitPropertiesSpec = Type.Object({
  handlers: HandlersSpec,
});

export const generateCallback = (
  handler: Omit<Static<typeof EventCallBackHandlerSpec>, 'type'>,
  rawHandlers: string | PropsBeforeEvaled<Static<typeof CallbackSpec>>,
  index: number,
  services: UIServices,
  slotKey: string,
  evalListItem?: boolean
) => {
  const { stateManager } = services;
  const send = () => {
    // Eval before sending event to assure the handler object is evaled from the latest state.
    const evalOptions = {
      slotKey,
      evalListItem,
    };
    const evaledHandlers = stateManager.deepEval(rawHandlers, evalOptions) as Static<
      typeof EventCallBackHandlerSpec
    >[];
    const evaledHandler = evaledHandlers[index];

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
    name: CoreTraitName.Event,
    description: 'export component events with advance features',
  },
  spec: {
    properties: EventTraitPropertiesSpec,
    methods: [],
    state: {},
  },
})(() => {
  return ({ trait, handlers, services, evalListItem, slotKey }) => {
    const callbackQueueMap: Record<string, Array<() => void>> = {};
    const rawHandlers = trait.properties.handlers;
    // setup current handlers
    for (const i in handlers) {
      const handler = handlers[i];

      if (!callbackQueueMap[handler.type]) {
        callbackQueueMap[handler.type] = [];
      }
      callbackQueueMap[handler.type].push(
        generateCallback(handler, rawHandlers, Number(i), services, slotKey, evalListItem)
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
