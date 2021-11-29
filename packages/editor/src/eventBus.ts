import mitt from 'mitt';
import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { IOperation } from './operations/type';

export const SelectComponentEvent = 'selectComponent';
export const HoverComponentEvent = 'hoverComponent';

const emitter = mitt<{
  operation: IOperation;
  redo: undefined;
  undo: undefined;
  componentsReload: ApplicationComponent[];
  componentsChange: ApplicationComponent[];
  appChange: Application;
  [SelectComponentEvent]: string;
  [HoverComponentEvent]: string;
}>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
