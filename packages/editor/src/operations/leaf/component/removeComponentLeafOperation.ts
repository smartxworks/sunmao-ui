import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type RemoveComponentLeafOperationContext = {
  componentId: string;
};

export class RemoveComponentLeafOperation extends BaseLeafOperation<RemoveComponentLeafOperationContext> {
  private deletedComponent?: IComponentModel;
  // FIXME: index is not a good type to remember a deleted resource
  private beforeComponent?: IComponentModel;

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    this.deletedComponent = appModel.getComponentById(
      this.context.componentId as ComponentId
    );
    this.beforeComponent = this.deletedComponent?.prevSilbling || undefined;
    console.log(this.beforeComponent)
    appModel.removeComponent(this.context.componentId as ComponentId);
    return appModel.toSchema();
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev);
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    if (!this.deletedComponent) {
      return prev;
    }
    const appModel = new ApplicationModel(prev);
    const parent = appModel.getComponentById(
      this.deletedComponent.parentId as ComponentId
    );
    if (parent) {
      parent.appendChild(
        this.deletedComponent,
        this.deletedComponent.parentSlot as SlotName
      );
    } else {
      appModel.updateSingleComponent(this.deletedComponent);
    }
    this.deletedComponent.moveAfter(this.beforeComponent?.id || null);
    console.log(appModel)
    return appModel.toSchema();
  }
}
