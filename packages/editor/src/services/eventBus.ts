import mitt from 'mitt';
import { ComponentSchema } from '@sunmao-ui/core';
import { IOperation } from '../operations/type';

export type EventNames = {
  operation: IOperation;
  redo: undefined;
  undo: undefined;
  // when switch app or module, current components refresh
  componentsRefresh: ComponentSchema[];
  // components change by operation
  stateRefresh: undefined;
  componentsChange: ComponentSchema[];
  // it is only used for some operations' side effect
  selectComponent: string;
  HTMLElementsUpdated: undefined;
  MaskWrapperScrollCapture: undefined;
};

export const initEventBus = () => {
  const emitter = mitt<EventNames>();
  return {
    on: emitter.on,
    off: emitter.off,
    send: emitter.emit,
  };
};

export type EventBusType = ReturnType<typeof initEventBus>;
