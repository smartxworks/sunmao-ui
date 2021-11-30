import mitt from 'mitt';
import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { IOperation } from './operations/type';
import { ImplementedRuntimeModule } from '../../runtime/lib';

export type EventNames = {
  operation: IOperation;
  redo: undefined;
  undo: undefined;
  componentsReload: ApplicationComponent[];
  componentsChange: ApplicationComponent[];
  selectComponent: string;
  hoverComponent: string;

  // for state decorators
  appChange: Application;
  modulesChange: ImplementedRuntimeModule[];
}

const emitter = mitt<EventNames>();

export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
