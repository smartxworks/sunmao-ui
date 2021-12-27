import { ApplicationComponent } from '@sunmao-ui/core';
import _ from 'lodash-es';
import { BaseLeafOperation } from '../../type';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';

export type ModifyTraitPropertiesLeafOperationContext = {
  componentId: string;
  traitIndex: number;
  properties: Record<string, any | (<T = any>(prev: T) => T)>;
};

export class ModifyTraitPropertiesLeafOperation extends BaseLeafOperation<ModifyTraitPropertiesLeafOperationContext> {
  private previousState: Record<string, any> = {};
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];
    for (const property in this.context.properties) {
      const oldValue = trait.properties[property]?.value;
      this.previousState[property] = oldValue;
      let newValue = this.context.properties[property];
      if (_.isFunction(newValue)) {
        // if modified value is a lazy function, execute it and assign
        newValue = newValue(_.cloneDeep(oldValue));
      }
      this.context.properties[property] = newValue;
      trait.updateProperty(property, this.context.properties[property]);
    }

    return appModel.toSchema();
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];

    for (const property in this.context.properties) {
      trait.updateProperty(property, this.context.properties[property]);
    }

    return appModel.toSchema();
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];

    for (const property in this.previousState) {
      trait.updateProperty(property, this.previousState[property]);
    }

    return appModel.toSchema();
  }
}
