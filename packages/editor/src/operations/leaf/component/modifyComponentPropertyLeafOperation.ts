import { BaseLeafOperation } from '../../type';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
export type ModifyComponentPropertyLeafOperationContext = {
  componentId: string;
  path: string;
  property: any;
};

export class ModifyComponentPropertyLeafOperation extends BaseLeafOperation<ModifyComponentPropertyLeafOperationContext> {
  private previousValue: any = undefined;
  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (component) {
      const oldValue = component.properties.getPropertyByPath(this.context.path);
      if (oldValue) {
        // assign previous data
        this.previousValue = oldValue;
        const newValue = this.context.property;
        oldValue.update(newValue);
      } else {
        console.warn('property not found');
      }
    } else {
      console.warn('component not found');
    }

    return prev;
  }

  redo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const newValue = this.context.property;
    component.properties.getPropertyByPath(this.context.path)!.update(newValue);
    return prev;
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    component.properties.getPropertyByPath(this.context.path)!.update(this.previousValue);

    return prev;
  }
}
