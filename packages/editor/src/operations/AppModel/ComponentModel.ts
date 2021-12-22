import { ApplicationComponent, RuntimeComponentSpec } from '@sunmao-ui/core';
import { registry } from '../../setup';
import { genComponent, genTrait } from './utils';
import {
  ComponentId,
  ComponentType,
  IApplicationModel,
  IComponentModel,
  SlotName,
  StyleSlotName,
  MethodName,
  StateKey,
  ITraitModel,
  IFieldModel,
  EventName,
  TraitType,
  TraitId,
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
        this.parentId = t.rawProperties.container.id;
        this.parentSlot = t.rawProperties.container.slot;
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

  get rawProperties() {
    const obj: Record<string, any> = {};
    for (const key in this.properties) {
      obj[key] = this.properties[key].value;
    }
    return obj;
  }

  private get slotTrait() {
    return this.traits.find(t => t.type === SlotTraitType);
  }

  toJS(): ApplicationComponent {
    if (this.isDirty) {
      this.isDirty = false;
      const newProperties = this.rawProperties;
      const newTraits = this.traits.map(t => t.toJS());
      const newSchema = genComponent(this.type, this.id, newProperties, newTraits);
      this.schema = newSchema;
    }
    return this.schema;
  }

  changeComponentProperty(propertyName: string, value: any) {
    this.properties[propertyName].update(value);
    this.isDirty = true;
  }

  addTrait(traitType: TraitType, properties: Record<string, unknown>): ITraitModel {
    const traitSchema = genTrait(traitType, properties);
    const trait = new TraitModel(traitSchema, this);
    this.traits.push(trait);
    this.isDirty = true;
    return trait;
  }

  appendTo = (parent?: IComponentModel, slot?: SlotName) => {
    // remove from current position
    if (this.parent) {
      const slotChildren = this.parent.children[this.parentSlot!];
      slotChildren.splice(slotChildren.indexOf(this), 1);
    }
    // update parent
    if (parent && slot) {
      if (!parent.children[slot]) {
        parent.children[slot] = [];
      }
  
      parent.children[slot].push(this);
      this.parent = parent;
      this.parentSlot = slot;
      this.parentId = parent.id;
      // update trait
      this.updateSlotTrait(parent.id, slot);
    } else {
      this.parent = null;
      this.parentSlot = null;
      this.parentId = null;
      if (this.slotTrait) {
        this.removeTrait(this.slotTrait?.id)
      }
      // remove from origin position in allComponents
      const oldIndex = this.appModel.allComponents.indexOf(this)
      if (oldIndex > -1){
        this.appModel.allComponents.splice(this.appModel.allComponents.indexOf(this), 1);
      }
    }
    // update app model
    this.appModel.updateSingleComponent(this);
    this.isDirty = true;
  };

  removeTrait(traitId: TraitId) {
    const traitIndex = this.traits.findIndex(t => t.id === traitId);
    if (traitIndex === -1) return;
    this.traits.splice(traitIndex, 1);
    this.isDirty = true;
  }

  changeId(newId: ComponentId) {
    this.id = newId;
    for (const slot in this.children) {
      const slotChildren = this.children[slot as SlotName];
      slotChildren.forEach(child => {
        child.parentId = newId;
        const slotTrait = child.traits.find(t => t.type === SlotTraitType);
        if (slotTrait) {
          slotTrait.properties.container.update({ id: newId, slot });
          slotTrait.isDirty = true;
        }
        child.isDirty = true;
      });
    }
    this.isDirty = true;
    return this;
  }

  moveAfter(after: ComponentId | null) {
    let siblings: IComponentModel[] = [];
    if (this.parent) {
      siblings = this.parent.children[this.parentSlot as SlotName];
    } else {
      siblings = this.appModel.model;
    }
    // update model
    siblings.splice(siblings.indexOf(this), 1);
    const afterIndexInSiblings = after ? siblings.findIndex(c => c.id === after) + 1 : 0;
    siblings.splice(afterIndexInSiblings, 0, this);

    // update allComponents schema
    const allComponents = this.appModel.allComponents;
    allComponents.splice(allComponents.indexOf(this), 1);
    // if moving to the first of siblings, move to the next after parent
    const afterTargetId = after || this.parent?.id;
    const afterIndexInAllComponents = afterTargetId
      ? allComponents.findIndex(c => c.id === afterTargetId) + 1
      : 0;
    allComponents.splice(afterIndexInAllComponents, 0, this);
    return this;
  }

  updateSlotTrait(parent: ComponentId, slot: SlotName) {
    if (this.slotTrait) {
      this.slotTrait.properties.container.update({ id: parent, slot });
      this.slotTrait.isDirty = true;
    } else {
      this.addTrait(SlotTraitType, { container: { id: parent, slot } });
    }
    this.isDirty = true;
  }
}
