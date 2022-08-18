import { isFunction, cloneDeep } from 'lodash';
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
  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];
    for (const property in this.context.properties) {
      const oldValue = trait.rawProperties[property];
      this.previousState[property] = oldValue;
      let newValue = this.context.properties[property];
      if (isFunction(newValue)) {
        // if modified value is a lazy function, execute it and assign
        newValue = newValue(cloneDeep(oldValue));
      }
      this.context.properties[property] = newValue;
      trait.updateProperty(property, this.context.properties[property]);
    }

    return prev;
  }

  redo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];

    for (const property in this.context.properties) {
      trait.updateProperty(property, this.context.properties[property]);
    }

    return prev;
  }

  undo(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const trait = component.traits[this.context.traitIndex];

    for (const property in this.previousState) {
      trait.updateProperty(property, this.previousState[property]);
    }

    return prev;
  }
}
