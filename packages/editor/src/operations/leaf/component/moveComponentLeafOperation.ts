import { BaseLeafOperation } from '../../type';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, SlotName } from '../../../AppModel/IAppModel';

export type MoveComponentLeafOperationContext = {
  componentId: string;
  parent?: string;
  slot?: string;
};

export class MoveComponentLeafOperation extends BaseLeafOperation<MoveComponentLeafOperationContext> {
  private originParent: ComponentId | null = null;
  private originSlot: SlotName | null = null;
  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    this.originParent = component.parentId;
    this.originSlot = component.parentSlot;

    if (!this.context.parent || !this.context.slot) {
      prev.appendChild(component);
      return prev;
    }

    const parent = prev.getComponentById(this.context.parent as ComponentId);
    if (!parent) {
      prev.appendChild(component);
    } else {
      parent.appendChild(component, this.context.slot as SlotName);
    }

    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId)!;
    if (!this.originParent) {
      prev.appendChild(component);
    } else {
      const parent = prev.getComponentById(this.originParent)!;
      parent.appendChild(component, this.originSlot!);
    }

    return prev;
  }
}
