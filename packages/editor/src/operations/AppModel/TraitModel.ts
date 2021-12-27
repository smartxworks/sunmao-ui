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
  _isDirty = false;

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

  get methods() {
    return this.spec ? this.spec.spec.methods as any : []
  }

  get stateKeys() {
    return (this.spec ? Object.keys(this.spec.spec.state.properties || {}) : []) as StateKey[];
  }

  toSchema(): ComponentTrait {
    if (this._isDirty) {
      this.schema = genTrait(this.type, this.rawProperties);
    }
    return this.schema;
  }

  updateProperty(key: string, value: any) {
    if (this.properties[key]) {
      this.properties[key].update(value);
    } else {
      this.properties[key] = new FieldModel(value);
    }
    this._isDirty = true;
    this.parent._isDirty = true;
  }
}
