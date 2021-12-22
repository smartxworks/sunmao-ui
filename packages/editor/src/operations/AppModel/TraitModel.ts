import { ComponentTrait, RuntimeTraitSpec } from '@sunmao-ui/core';
import { registry } from '../../setup';
import {
  IComponentModel,
  MethodName,
  TraitType,
  ITraitModel,
  IFieldModel,
  StateKey,
  TraitId,
} from './IAppModel';
import { FieldModel } from './FieldModel';
import { genTrait } from './utils';

let traitIdCount = 0;

export class TraitModel implements ITraitModel {
  private schema: ComponentTrait;
  private spec: RuntimeTraitSpec;
  id: TraitId;
  type: TraitType;
  properties: Record<string, IFieldModel> = {};
  isDirty = false;

  constructor(trait: ComponentTrait, public parent: IComponentModel) {
    this.schema = trait;
    this.parent = parent;
    this.type = trait.type as TraitType;
    this.id = `${this.parent.id}_trait${traitIdCount++}` as TraitId;
    this.spec = registry.getTraitByType(this.type);

    for (const key in trait.properties) {
      this.properties[key] = new FieldModel(trait.properties[key]);
    }
    this.properties;
  }

  get rawProperties() {
    const obj: Record<string, any> = {};
    for (const key in this.properties) {
      obj[key] = this.properties[key].value;
    }
    return obj;
  }

  toJS(): ComponentTrait {
    if (this.isDirty) {
      this.schema = genTrait(this.type, this.rawProperties);
    }
    return this.schema;
  }

  get methods() {
    return (this.spec ? this.spec.spec.methods.map(m => m.name) : []) as MethodName[];
  }

  get stateKeys() {
    return (this.spec ? Object.keys(this.spec.spec.state) : []) as StateKey[];
  }

  updateProperty(key: string, value: any) {
    if (this.properties[key]) {
      this.properties[key].update(value);
    } else {
      this.properties[key] = new FieldModel(value);
    }
    this.isDirty = true;
    this.parent.isDirty = true;
  }
}
