import { ComponentSchema } from '@sunmao-ui/core';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  rootComponentId: string;
  components: ComponentSchema[];
  copyTimes: number;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private componentCopy!: IComponentModel

  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev, this.registry);
    const targetParent = appModel.getComponentById(this.context.parentId as ComponentId);
    if (!targetParent) {
      return prev
    }
    const copyComponents = new AppModel(this.context.components, this.registry);
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

  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.do(prev)
  }
  
  undo(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev, this.registry);
    appModel.removeComponent(this.componentCopy.id);
    return appModel.toSchema()
  }
}
