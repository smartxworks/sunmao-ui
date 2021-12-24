import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../AppModel/AppModel';
import { ComponentId, TraitId, TraitType } from '../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';

export type CreateTraitLeafOperationContext = {
  componentId: string;
  traitType: string;
  properties: Record<string, any>;
};

export class CreateTraitLeafOperation extends BaseLeafOperation<CreateTraitLeafOperationContext> {
  private traitId!: TraitId;

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev
    }
    const trait = component.addTrait(this.context.traitType as TraitType, this.context.properties);
    this.traitId = trait.id;
    return appModel.toSchema()
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev);
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      return prev
    }
    component.removeTrait(this.traitId);
    return appModel.toSchema()
  }
}
