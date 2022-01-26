import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, ITraitModel } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type RemoveTraitLeafOperationContext = {
  componentId: string;
  index: number;
};

export class RemoveTraitLeafOperation extends BaseLeafOperation<RemoveTraitLeafOperationContext> {
  private deletedTrait!: ITraitModel;
  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    this.deletedTrait = component.traits[this.context.index];
    component.removeTrait(this.deletedTrait.id);
    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    component.addTrait(this.deletedTrait.type, this.deletedTrait.rawProperties);
    return prev;
  }
}
