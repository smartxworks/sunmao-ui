import {
  ApplicationComponent,
  MethodSchema,
  RuntimeComponentSpec,
} from '@sunmao-ui/core';
import { registry } from '../setup';
import { genComponent, genTrait } from './utils';
import {
  ComponentId,
  ComponentType,
  IAppModel,
  IComponentModel,
  SlotName,
  StyleSlotName,
  StateKey,
  ITraitModel,
  IFieldModel,
  EventName,
  TraitType,
  TraitId,
  MethodName,
} from './IAppModel';
import { TraitModel } from './TraitModel';
import { FieldModel } from './FieldModel';
type ComponentSpecModel = RuntimeComponentSpec<MethodName, StyleSlotName, SlotName, EventName>
const SlotTraitType: TraitType = 'core/v1/slot' as TraitType;
export class ComponentModel implements IComponentModel {
  private spec: ComponentSpecModel;

  id: ComponentId;
  type: ComponentType;
  properties: Record<string, IFieldModel> = {};
  children: Record<SlotName, IComponentModel[]> = {};
  parent: IComponentModel | null = null;
  parentId: ComponentId | null = null;
  parentSlot: SlotName | null = null;
  traits: ITraitModel[] = [];
  _isDirty = false;

  constructor(public appModel: IAppModel, private schema: ApplicationComponent) {
    this.schema = schema;

    this.id = schema.id as ComponentId;
    this.type = schema.type as ComponentType;
    this.spec = registry.getComponentByType(this.type) as any;

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
    const componentStateKeys = Object.keys(
      this.spec.spec.state.properties || {}
    ) as StateKey[];
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
    const componentMethods = [];
    for (const methodName in this.spec.spec.methods) {
      componentMethods.push({
        name: methodName,
        parameters: this.spec.spec.methods[methodName as MethodName]!,
      })
    }
    const traitMethods: MethodSchema[] = this.traits.reduce(
      (acc, t) => acc.concat(t.methods),
      [] as MethodSchema[]
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

  get prevSilbling() {
    if (!this.parent) return null;
    const parentChildren = this.parent.children[this.parentSlot!];
    const index = parentChildren.indexOf(this);
    if (index === 0) return null;
    return parentChildren[index - 1];
  }

  get nextSilbing() {
    if (!this.parent) return null;
    const parentChildren = this.parent.children[this.parentSlot!];
    const index = parentChildren.indexOf(this);
    if (index === parentChildren.length - 1) return null;
    return parentChildren[index + 1];
  }

  get _slotTrait() {
    return this.traits.find(t => t.type === SlotTraitType) || null;
  }

  get allComponents(): IComponentModel[] {
    const result: IComponentModel[] = [];
    this.traverseTree(c => {
      result.push(c);
    });
    return result;
  }

  toSchema(): ApplicationComponent {
    if (this._isDirty) {
      this._isDirty = false;
      const newProperties = this.rawProperties;
      const newTraits = this.traits.map(t => t.toSchema());
      const newSchema = genComponent(this.type, this.id, newProperties, newTraits);
      this.schema = newSchema;
    }
    return this.schema;
  }

  updateComponentProperty(propertyName: string, value: any) {
    if (!Reflect.has(this.properties, propertyName)) {
      this.properties[propertyName] = new FieldModel(value)
    } else {
      this.properties[propertyName].update(value);
    }
    this._isDirty = true;
  }

  addTrait(traitType: TraitType, properties: Record<string, unknown>): ITraitModel {
    const traitSchema = genTrait(traitType, properties);
    const trait = new TraitModel(traitSchema, this);
    this.traits.push(trait);
    this._isDirty = true;
    return trait;
  }

  appendTo = (parent?: IComponentModel, slot?: SlotName) => {
    // remove from current position
    if (this.parent) {
      this.parent.removeChild(this);
    }
    if (!parent || !slot) {
      this.appModel.appendChild(this);
      return;
    }
    // update parent
    if (!parent.children[slot]) {
      parent.children[slot] = [];
    }

    parent.children[slot].push(this);
    parent.appModel._bindComponentToModel(this);
    this.parent = parent;
    this.parentSlot = slot;
    this.parentId = parent.id;
    // update trait
    this.updateSlotTrait(parent.id, slot);
    this._isDirty = true;
  };

  removeChild(child: IComponentModel) {
    const slotChildren = this.children[child.parentSlot!];
    if (slotChildren) {
      slotChildren.splice(slotChildren.indexOf(child), 1);
      child._isDirty = true;
      this._isDirty = true;
    }
  }

  removeTrait(traitId: TraitId) {
    const traitIndex = this.traits.findIndex(t => t.id === traitId);
    if (traitIndex === -1) return;
    this.traits.splice(traitIndex, 1);
    this._isDirty = true;
  }

  changeId(newId: ComponentId) {
    const isIdExist = !!this.appModel.getComponentById(newId);
    if (isIdExist) {
      throw Error(`Id ${newId} already exist`);
      return this;
    }
    this.id = newId;
    for (const slot in this.children) {
      const slotChildren = this.children[slot as SlotName];
      slotChildren.forEach(child => {
        child.parentId = newId;
        const slotTrait = child.traits.find(t => t.type === SlotTraitType);
        if (slotTrait) {
          slotTrait.properties.container.update({ id: newId, slot });
          slotTrait._isDirty = true;
        }
        child._isDirty = true;
      });
    }
    this._isDirty = true;
    return this;
  }

  moveAfter(after: IComponentModel | null) {
    let siblings: IComponentModel[] = [];
    if (this.parent) {
      siblings = this.parent.children[this.parentSlot as SlotName];
    } else {
      siblings = this.appModel.topComponents;
    }
    // update model
    siblings.splice(siblings.indexOf(this), 1);
    const afterIndexInSiblings = after
      ? siblings.findIndex(c => c.id === after.id) + 1
      : 0;
    siblings.splice(afterIndexInSiblings, 0, this);
    return this;
  }

  appendChild(child: IComponentModel, slot: SlotName) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (!this.children[slot]) {
      this.children[slot] = [];
    }
    this.children[slot].push(child);
    child.parent = this;
    child.parentSlot = slot;
    child.parentId = this.id;
    child.updateSlotTrait(this.id, slot);
    this.appModel._bindComponentToModel(child);
    this.traverseTree(c => {
      this.appModel._bindComponentToModel(c);
    });
  }

  updateTraitProperties(traitId: TraitId, properties: Record<string, unknown>) {
    const trait = this.traits.find(t => t.id === traitId);
    if (!trait) return;
    for (const property in properties) {
      trait.properties[property].update(properties[property]);
      trait._isDirty = true;
    }
    this._isDirty = true;
  }

  updateSlotTrait(parent: ComponentId, slot: SlotName) {
    if (this._slotTrait) {
      this._slotTrait.properties.container.update({ id: parent, slot });
      this._slotTrait._isDirty = true;
    } else {
      this.addTrait(SlotTraitType, { container: { id: parent, slot } });
    }
    this._isDirty = true;
  }

  private traverseTree(cb: (c: IComponentModel) => void) {
    function traverse(root: IComponentModel) {
      cb(root);
      for (const slot in root.children) {
        root.children[slot as SlotName].forEach(child => {
          traverse(child);
        });
      }
    }
    traverse(this);
  }
}
