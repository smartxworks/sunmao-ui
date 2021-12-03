import mitt from 'mitt';
import { ApplicationComponent } from '@sunmao-ui/core';
import { IOperation } from './operations/type';

export type EventNames = {
  operation: IOperation;
  redo: undefined;
  undo: undefined;
  copy: { componentId: string };
  cutComponent: { componentId: string };
  paste: { componentId: string };
  // when switch app or module, current components refresh
  componentsRefresh: ApplicationComponent[];
  // components change by operation
  componentsChange: ApplicationComponent[];
  // it is only used for some operations' side effect
  selectComponent: string;
};

const emitter = mitt<EventNames>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
