import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../type';

export type ReplaceAppLeafOperationContext = {
  app: ApplicationComponent[];
};

export class ReplaceAppLeafOperation extends BaseLeafOperation<ReplaceAppLeafOperationContext> {
  private previousState!: ApplicationComponent[];
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    this.previousState = prev;
    return produce(prev, () => {
      return this.context.app;
    });
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, () => {
      return this.context.app;
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, () => {
      return this.previousState;
    });
  }
}
