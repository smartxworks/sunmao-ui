import { ApplicationComponent } from '@sunmao-ui/core';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, ITraitModel } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type RemoveTraitLeafOperationContext = {
  componentId: string;
  index: number;
};

export class RemoveTraitLeafOperation extends BaseLeafOperation<RemoveTraitLeafOperationContext> {
  private deletedTrait!: ITraitModel;
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    this.deletedTrait = component.traits[this.context.index];
    component.removeTrait(this.deletedTrait.id);
    return appModel.toSchema();
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev);
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    component.addTrait(this.deletedTrait.type, this.deletedTrait.rawProperties);
    return appModel.toSchema();
  }
}
