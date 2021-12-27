import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  rootComponentId: string;
  components: ApplicationComponent[];
  copyTimes: number;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private componentCopy!: IComponentModel

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const targetParent = appModel.getComponentById(this.context.parentId as ComponentId);
    if (!targetParent) {
      return prev
    }
    const copyComponents = new ApplicationModel(this.context.components);
    const component = copyComponents.getComponentById(this.context.rootComponentId as ComponentId);
    if (!component){
      return prev;
    }
    component.allComponents.forEach((c) => {
      c.changeId(`${c.id}_copy${this.context.copyTimes}` as ComponentId)
    })
    targetParent.appendChild(component, this.context.slot as SlotName);
    this.componentCopy = component;

    return appModel.toSchema();
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev)
  }
  
  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    appModel.removeComponent(this.componentCopy.id);
    return appModel.toSchema()
  }
}
