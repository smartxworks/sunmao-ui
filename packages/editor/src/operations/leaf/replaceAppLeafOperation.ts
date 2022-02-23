import { AppModel } from '../../AppModel/AppModel';
import { BaseLeafOperation } from '../type';

export type ReplaceAppLeafOperationContext = {
  app: AppModel;
};

export class ReplaceAppLeafOperation extends BaseLeafOperation<ReplaceAppLeafOperationContext> {
  private previousState!: AppModel;
  do(): AppModel {
    return this.context.app;
  }

  redo(): AppModel {
    return this.context.app;
  }

  undo(): AppModel {
    return this.previousState;
  }
}
