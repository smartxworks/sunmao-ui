import mitt from 'mitt';
import { Application } from '@meta-ui/core';
import { Operations } from './operations/Operations';

const emitter = mitt<{
  operation: Operations;
  undo: undefined;
  appChange: Application;
}>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
