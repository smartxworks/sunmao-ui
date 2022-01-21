import { AppModel } from '../../../AppModel/AppModel';
import {
  ComponentId,
  ComponentType,
  IComponentModel,
  SlotName,
} from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type CreateComponentLeafOperationContext = {
  componentType: string;
  componentId: string;
  parentId?: ComponentId;
  slot?: SlotName;
};

export class CreateComponentLeafOperation extends BaseLeafOperation<CreateComponentLeafOperationContext> {
  private component!: IComponentModel;

  do(prev: AppModel): AppModel {
    const component = prev.createComponent(
      this.context.componentType as ComponentType,
      this.context.componentId as ComponentId
    );
    if (this.context.parentId) {
      const parent = prev.getComponentById(this.context.parentId);
      if (parent) {
        component.appendTo(parent, this.context.slot);
      }
    } else {
      component.appendTo();
    }
    this.component = component;
    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    prev.removeComponent(this.component.id);
    return prev;
  }
}
