import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  component: IComponentModel;
  copyTimes: number;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private componentCopy!: IComponentModel;

  do(prev: AppModel): AppModel {
    const targetParent = prev.getComponentById(this.context.parentId as ComponentId);
    if (!targetParent) {
      return prev;
    }
    const component = this.context.component;
    if (!component) {
      return prev;
    }

    component.allComponents.forEach(c => {
      c.changeId(`${c.id}_copy${this.context.copyTimes}` as ComponentId);
    });
    targetParent.appendChild(component, this.context.slot as SlotName);
    this.componentCopy = component;

    return prev;
  }

  redo(prev: AppModel): AppModel {
    const targetParent = prev.getComponentById(this.context.parentId as ComponentId);
    if (!targetParent) {
      return prev;
    }

    targetParent.appendChild(this.componentCopy, this.context.slot as SlotName);
    return prev;
  }

  undo(prev: AppModel): AppModel {
    prev.removeComponent(this.componentCopy.id);
    return prev;
  }
}
