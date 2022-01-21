
import produce from 'immer';
import { AppModel } from '../../AppModel/AppModel';
import { BaseLeafOperation } from '../type';

export type ReplaceAppLeafOperationContext = {
  app: AppModel;
};

export class ReplaceAppLeafOperation extends BaseLeafOperation<ReplaceAppLeafOperationContext> {
  private previousState!: AppModel;
  do(prev: AppModel): AppModel {
    this.previousState = prev;
    return produce(prev, () => {
      return this.context.app;
    });
  }

  redo(prev: AppModel): AppModel {
    return produce(prev, () => {
      return this.context.app;
    });
  }

  undo(prev: AppModel): AppModel {
    return produce(prev, () => {
      return this.previousState;
    });
  }
}
