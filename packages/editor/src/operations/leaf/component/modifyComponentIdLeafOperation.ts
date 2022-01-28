import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type ModifyComponentIdLeafOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdLeafOperation extends BaseLeafOperation<ModifyComponentIdLeafOperationContext> {
  do(prev: AppModel): AppModel {
    const oldId = this.context.componentId as ComponentId;
    const newId = this.context.newId as ComponentId;
    const component = prev.getComponentById(oldId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    component.changeId(newId);
    prev.changeComponentMapId(oldId, newId);
    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.newId as ComponentId)!;
    component.changeId(this.context.componentId as ComponentId);
    return prev;
  }
}
