import { ComponentSchema } from '@sunmao-ui/core';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type ModifyComponentIdLeafOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdLeafOperation extends BaseLeafOperation<ModifyComponentIdLeafOperationContext> {
  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    component.changeId(this.context.newId as ComponentId);
    return appModel.toSchema();
  }
  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.do(prev);
  }
  undo(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.newId as ComponentId)!;
    component.changeId(this.context.componentId as ComponentId);
    return appModel.toSchema();
  }
}
