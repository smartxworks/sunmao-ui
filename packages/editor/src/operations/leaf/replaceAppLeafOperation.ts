import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../type';

export type ReplaceAppLeafOperationContext = {
  app: Application;
};

export class ReplaceAppLeafOperation extends BaseLeafOperation<ReplaceAppLeafOperationContext> {
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
