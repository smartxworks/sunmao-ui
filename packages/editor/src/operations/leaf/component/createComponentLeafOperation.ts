import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../../AppModel/AppModel';
import { ComponentId, ComponentType, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type CreateComponentLeafOperationContext = {
  componentType: string;
  componentId: string;
  parentId?: ComponentId;
  slot?: SlotName;
};

export class CreateComponentLeafOperation extends BaseLeafOperation<CreateComponentLeafOperationContext> {
  private component!: IComponentModel;

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.createComponent(this.context.componentType as ComponentType, this.context.componentId as ComponentId);
    if (this.context.parentId) {
      const parent = appModel.getComponentById(this.context.parentId);
      if (parent) {
        component.appendTo(parent, this.context.slot);
      }
    } else {
      component.appendTo();
    }
    this.component = component;
    const newSchema = appModel.toSchema()
    return newSchema
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev)
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    appModel.removeComponent(this.component.id)
    return appModel.toSchema()
  }
}
