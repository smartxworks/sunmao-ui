import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash';
import {
  EventCallBackHandlerSpec,
  MODULE_ID_EXP,
  EventHandlerSpec,
} from '@sunmao-ui/shared';
import { type PropsBeforeEvaled } from '@sunmao-ui/core';
import { UIServices } from '../types';

const CallbackSpec = Type.Array(EventCallBackHandlerSpec);

export const runEventHandler = (
  handler: Static<typeof EventCallBackHandlerSpec>,
  rawHandlers: string | PropsBeforeEvaled<Static<typeof CallbackSpec>>,
  index: number,
  services: UIServices,
  slotKey: string,
  triggerId = '',
  eventType = ''
) => {
  const { stateManager } = services;
  const send = () => {
    // Eval before sending event to assure the handler object is evaled from the latest state.
    const evalOptions = {
      slotKey,
      // keep MODULE_ID_EXP when error
      fallbackWhenError(exp: string, err: Error) {
        return exp === MODULE_ID_EXP ? exp : err;
      },
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
      triggerId,
      eventType: eventType || (handler as Static<typeof EventHandlerSpec>)?.type,
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
