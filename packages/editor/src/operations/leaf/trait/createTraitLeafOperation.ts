import { ComponentSchema } from '@sunmao-ui/core';
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

  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev
    }
    const trait = component.addTrait(this.context.traitType as TraitType, this.context.properties);
    this.traitId = trait.id;
    return appModel.toSchema()
  }

  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.do(prev);
  }

  undo(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev
    }
    component.removeTrait(this.traitId);
    return appModel.toSchema()
  }
}
