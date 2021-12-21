import { ApplicationComponent, RuntimeComponentSpec } from '@sunmao-ui/core';
import { registry } from '../../setup';
import { genComponent, genTrait, getPropertyObject } from './utils';
import {
  ComponentId,
  ComponentType,
  IApplicationModel,
  IComponentModel,
  IModuleModel,
  ModuleId,
  ModuleType,
  SlotName,
  StyleSlotName,
  MethodName,
  StateKey,
  ITraitModel,
  IFieldModel,
  EventName,
  TraitType,
} from './IAppModel';
import { TraitModel } from './TraitModel';
import { FieldModel } from './FieldModel';

const SlotTraitType: TraitType = 'core/v1/slot' as TraitType;
export class ComponentModel implements IComponentModel {
  private spec: RuntimeComponentSpec;

  id: ComponentId;
  type: ComponentType;
  properties: Record<string, IFieldModel> = {};
  children: Record<SlotName, IComponentModel[]> = {};
  parent: IComponentModel | null = null;
  parentId: ComponentId | null = null;
  parentSlot: SlotName | null = null;
  traits: ITraitModel[] = [];
  isDirty = false;

  constructor(public appModel: IApplicationModel, private schema: ApplicationComponent) {
    this.schema = schema;

    this.id = schema.id as ComponentId;
    this.type = schema.type as ComponentType;
    this.spec = registry.getComponentByType(this.type);

    this.traits = schema.traits.map(t => new TraitModel(t, this));
    // find slot trait
    this.traits.forEach(t => {
      if (t.type === 'core/v1/slot') {
        this.parentId = t.properties.container.id;
        this.parentSlot = t.properties.container.slot;
      }
    });

    for (const key in schema.properties) {
      this.properties[key] = new FieldModel(schema.properties[key]);
    }
  }

  get slots() {
    return (this.spec ? this.spec.spec.slots : []) as SlotName[];
  }

  get stateKeys() {
    if (!this.spec) return [];
    const componentStateKeys = Object.keys(this.spec.spec.state) as StateKey[];
    const traitStateKeys: StateKey[] = this.traits.reduce(
      (acc, t) => acc.concat(t.stateKeys),
      [] as StateKey[]
    );
    return [...componentStateKeys, ...traitStateKeys];
  }

  get events() {
    return (this.spec ? this.spec.spec.events : []) as EventName[];
  }

  get methods() {
    if (!this.spec) return [];
    const componentMethods = this.spec.spec.methods.map(m => m.name) as MethodName[];
    const traitMethods: MethodName[] = this.traits.reduce(
      (acc, t) => acc.concat(t.methods),
      [] as MethodName[]
    );
    return [...componentMethods, ...traitMethods];
  }

  get styleSlots() {
    return (this.spec ? this.spec.spec.styleSlots : []) as StyleSlotName[];
  }

  get json(): ApplicationComponent {
    if (!this.isDirty) {
      return this.schema;
    }
    this.isDirty = false;
    const newProperties = getPropertyObject(this.properties);
    const newTraits = this.traits.map(t => t.json);
    const newSchema = genComponent(this.type, this.id, newProperties, newTraits);
    this.schema = newSchema;
    return this.schema;

    // if (this.isDirty || this.traits.length !== this.origin.traits.length) {
    //   return {
    //     ...this.origin,
    //     traits: this.traits.map(t => t.json),
    //   };
    // } else {
    //   const isChanged = this.traits.some(t => t.isDirty);
    //   if (isChanged) {
    //     return {
    //       ...this.origin,
    //       traits: this.traits.map(t => t.json),
    //     };
    //   }
    // }

    // return this.origin;
  }

  changeComponentProperty(propertyName: string, value: any) {
    this.properties[propertyName].update(value);
    this.isDirty = true;
    // const newSchema = produce(this.schema, draft => {
    //   draft[componentIndex].properties[propertyName] = value;
    // });
    // this.updateSchema(newSchema)
  }

  addTrait(traitType: TraitType, properties: Record<string, unknown>): ITraitModel {
    const traitSchema = genTrait(traitType, properties);
    const trait = new TraitModel(traitSchema, this);
    this.traits.push(trait);
    this.isDirty = true;
    return trait;
  }

  appendTo = (slot: SlotName, parent: IComponentModel) => {
    if (!parent.children[slot]) {
      parent.children[slot] = [];
    }

    // update parent
    parent.children[slot].push(this);
    this.parent = parent;
    this.parentSlot = slot;
    this.parentId = parent.id;

    // update app model
    this.appModel.updateSingleComponent(this);

    // update trait
    this.addTrait(SlotTraitType, { container: { id: parent.id, slot } });
    this.isDirty = true;
  };
}
