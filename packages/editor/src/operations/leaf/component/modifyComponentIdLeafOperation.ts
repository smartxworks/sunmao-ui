import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../AppModel/AppModel';
import { ComponentId } from '../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type ModifyComponentIdLeafOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdLeafOperation extends BaseLeafOperation<ModifyComponentIdLeafOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    component.changeId(this.context.newId as ComponentId);
    return appModel.toJS();
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev);
  }
  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.getComponentById(this.context.newId as ComponentId)!;
    component.changeId(this.context.componentId as ComponentId);
    return appModel.toJS();
  }
}
