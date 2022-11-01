import { TraitSchema, RuntimeTrait } from '@sunmao-ui/core';
import { RegistryInterface } from '@sunmao-ui/runtime';
import {
  IComponentModel,
  TraitType,
  ITraitModel,
  IFieldModel,
  TraitId,
} from './IAppModel';
import { FieldModel } from './FieldModel';
import { genTrait } from './utils';

let traitIdCount = 0;

export class TraitModel implements ITraitModel {
  private schema: TraitSchema;
  spec: RuntimeTrait;
  id: TraitId;
  type: TraitType;
  properties: IFieldModel;
  _isDirty = false;

  constructor(
    trait: TraitSchema,
    private registry: RegistryInterface,
    public parent: IComponentModel
  ) {
    this.schema = trait;
    this.parent = parent;
    this.type = trait.type as TraitType;
    this.id = `${this.parent.id}_trait${traitIdCount++}` as TraitId;
    this.spec = this.registry.getTraitByType(this.type);

    this.properties = new FieldModel(
      trait.properties,
      this.parent,
      this.spec.spec.properties,
      this
    );
  }

  get rawProperties() {
    return this.properties.rawValue;
  }

  get methods() {
    return this.spec ? this.spec.spec.methods : [];
  }

  toSchema(): TraitSchema {
    if (this._isDirty) {
      this.schema = genTrait(this.type, this.rawProperties);
    }
    return this.schema;
  }

  updateProperty(key: string, value: any) {
    this.properties.update({ [key]: value });
    this._isDirty = true;
    this.parent._isDirty = true;
  }
}
