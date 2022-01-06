import { ComponentSchema } from '@sunmao-ui/core';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type RemoveComponentLeafOperationContext = {
  componentId: string;
};

export class RemoveComponentLeafOperation extends BaseLeafOperation<RemoveComponentLeafOperationContext> {
  private deletedComponent?: IComponentModel;
  private prevComponent?: IComponentModel;

  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    this.deletedComponent = appModel.getComponentById(
      this.context.componentId as ComponentId
    );
    this.prevComponent = this.deletedComponent?.prevSilbling || undefined;
    appModel.removeComponent(this.context.componentId as ComponentId);
    return appModel.toSchema();
  }

  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.do(prev);
  }

  undo(prev: ComponentSchema[]): ComponentSchema[] {
    if (!this.deletedComponent) {
      return prev;
    }
    const appModel = new AppModel(prev);
    const parent = appModel.getComponentById(
      this.deletedComponent.parentId as ComponentId
    );
    if (parent) {
      parent.appendChild(
        this.deletedComponent,
        this.deletedComponent.parentSlot as SlotName
      );
    } else {
      appModel.appendChild(this.deletedComponent);
    }
    this.deletedComponent.moveAfter(this.prevComponent || null);
    return appModel.toSchema();
  }
}
