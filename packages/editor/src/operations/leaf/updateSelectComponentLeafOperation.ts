
import { AppModel } from '../../AppModel/AppModel';
import { BaseLeafOperation } from '../type';

export type UpdateSelectComponentLeafOperationContext = {
  componentId?: string;
  newId: string;
};

export class UpdateSelectComponentLeafOperation extends BaseLeafOperation<UpdateSelectComponentLeafOperationContext> {
  prevId!: string;
  do(prev: AppModel): AppModel {
    this.prevId = this.context.componentId || prev.topComponents[0].id;
    setTimeout(() => {
      // eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  redo(prev: AppModel): AppModel {
    setTimeout(() => {
      // eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  undo(prev: AppModel): AppModel {
    setTimeout(() => {
      // eventBus.send('selectComponent', this.prevId);
    });
    return prev;
  }
}
