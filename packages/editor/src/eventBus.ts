import mitt from 'mitt';
import { Application } from '@sunmao-ui/core';
import { IOperation } from './operations/type';

export const SelectComponentEvent = 'selectComponent';
export const HoverComponentEvent = 'hoverComponent';

const emitter = mitt<{
  operation: IOperation;
  redo: undefined;
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
