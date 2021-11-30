import mitt from 'mitt';
import { ApplicationComponent } from '@sunmao-ui/core';
import { IOperation } from './operations/type';

export type EventNames = {
  operation: IOperation;
  redo: undefined;
  undo: undefined;
  // when switch app or module, current components refresh
  componentsRefresh: ApplicationComponent[];
  // components change by operation
  componentsChange: ApplicationComponent[];
  selectComponent: string;
  hoverComponent: string;
}

const emitter = mitt<EventNames>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
