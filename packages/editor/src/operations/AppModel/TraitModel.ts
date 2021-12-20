import {
  ComponentTrait,
  RuntimeTraitSpec,
} from '@sunmao-ui/core';
import { registry } from '../../setup';
import {
  IComponentModel,
  MethodName,
  TraitType,
  ITraitModel,
  IFieldModel,
  StateKey,
} from './IAppModel';
import { FieldModel } from './FieldModel';

export class TraitModel implements ITraitModel {
  private origin: ComponentTrait;
  private spec: RuntimeTraitSpec;

  type: TraitType;
  properties: Record<string, any>;
  propertiesMedatadata: Record<string, IFieldModel> = {};
  parent: IComponentModel;

  constructor(trait: ComponentTrait, parent: IComponentModel) {
    this.origin = trait;
    this.parent = parent;
    this.type = trait.type as TraitType;
    this.spec = registry.getTraitByType(this.type);

    this.properties = trait.properties || {};
    for (const key in trait.properties) {
      this.propertiesMedatadata[key] = new FieldModel(trait.properties[key]);
    }
    this.propertiesMedatadata;
  }

  get json(): ComponentTrait {
    return this.origin;
  }

  get methods() {
    return (this.spec ? this.spec.spec.methods.map(m => m.name) : []) as MethodName[];
  }

  get stateKeys() {
    return (this.spec ? Object.keys(this.spec.spec.state) : []) as StateKey[];
  }
}
