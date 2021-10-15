import mitt from 'mitt';
import { Application } from '@meta-ui/core';
import { Operations } from './operations/Operations';

export const SelectComponentEvent = 'selectComponent';
export const HoverComponentEvent = 'hoverComponent';

const emitter = mitt<{
  operation: Operations;
  undo: undefined;
  appChange: Application;
  [SelectComponentEvent]: string;
  [HoverComponentEvent]: string;
}>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
