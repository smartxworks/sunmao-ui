
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type RemoveComponentLeafOperationContext = {
  componentId: string;
};

export class RemoveComponentLeafOperation extends BaseLeafOperation<RemoveComponentLeafOperationContext> {
  private deletedComponent?: IComponentModel;
  private prevComponent?: IComponentModel;

  do(prev: AppModel): AppModel {
    this.deletedComponent = prev.getComponentById(
      this.context.componentId as ComponentId
    );
    this.prevComponent = this.deletedComponent?.prevSilbling || undefined;
    prev.removeComponent(this.context.componentId as ComponentId);
    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    if (!this.deletedComponent) {
      return prev;
    }
    const parent = prev.getComponentById(
      this.deletedComponent.parentId as ComponentId
    );
    if (parent) {
      parent.appendChild(
        this.deletedComponent,
        this.deletedComponent.parentSlot as SlotName
      );
    } else {
      prev.appendChild(this.deletedComponent);
    }
    this.deletedComponent.moveAfter(this.prevComponent || null);
    return prev;
  }
}
