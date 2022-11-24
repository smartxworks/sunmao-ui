import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, TraitId, TraitType } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type CreateTraitLeafOperationContext = {
  componentId: string;
  traitType: string;
  properties: Record<string, any>;
};

export class CreateTraitLeafOperation extends BaseLeafOperation<CreateTraitLeafOperationContext> {
  private traitId!: TraitId;

  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev;
    }
    const trait = component.addTrait(
      this.context.traitType as TraitType,
      this.context.properties
    );
    this.traitId = trait.id;
    return prev;
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev;
    }
    component.removeTrait(this.traitId);
    return prev;
  }
}
