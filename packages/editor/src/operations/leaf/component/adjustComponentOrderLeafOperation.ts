import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderLeafOperationContext = {
  orientation: 'up' | 'down';
  componentId: string;
};

export class AdjustComponentOrderLeafOperation extends BaseLeafOperation<AdjustComponentOrderLeafOperationContext> {
  do(prev: AppModel): AppModel {
    return this.move(prev, this.context.orientation);
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    return this.move(prev, this.context.orientation === 'up' ? 'down' : 'up');
  }

  private move(prev: AppModel, orientation: 'up' | 'down'): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    switch (orientation) {
      case 'up':
        if (!component.prevSilbling) {
          console.warn('destination index out of bound');
          return prev;
        }
        component.moveAfter(component.prevSilbling?.prevSilbling || null);
        break;
      case 'down':
        if (!component.nextSilbing) {
          console.warn('destination index out of bound');
          return prev;
        }
        component.moveAfter(component.nextSilbing || null);
        break;
    }
    return prev;
  }
}
