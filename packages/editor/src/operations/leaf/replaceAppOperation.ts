import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../type';

export type ReplaceAppOperationContext = {
  app: Application;
};

export class ReplaceAppOperation extends BaseLeafOperation<ReplaceAppOperationContext> {
  private previousState!: Application;
  do(prev: Application): Application {
    this.previousState = prev;
    return produce(prev, () => {
      return this.context.app;
    });
  }

  redo(prev: Application): Application {
    return produce(prev, () => {
      return this.context.app;
    });
  }

  undo(prev: Application): Application {
    return produce(prev, () => {
      return this.previousState;
    });
  }
}
