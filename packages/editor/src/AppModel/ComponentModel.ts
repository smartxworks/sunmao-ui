import { merge } from 'lodash';
import { RegistryInterface } from '@sunmao-ui/runtime';
import {
  generateDefaultValueFromSpec,
  CORE_VERSION,
  CoreTraitName,
  AnyTypePlaceholder,
} from '@sunmao-ui/shared';
import {
  ComponentSchema,
  MethodSchema,
  RuntimeComponent,
  SlotSpec,
} from '@sunmao-ui/core';
import { genComponent, genTrait } from './utils';
import {
  ComponentId,
  ComponentType,
  IAppModel,
  IComponentModel,
  SlotName,
  StyleSlotName,
  ITraitModel,
  IFieldModel,
  EventName,
  TraitType,
  TraitId,
  MethodName,
} from './IAppModel';
import { TraitModel } from './TraitModel';
import { FieldModel } from './FieldModel';
import { AppModel } from './AppModel';

const SlotTraitType: TraitType = `${CORE_VERSION}/${CoreTraitName.Slot}` as TraitType;
const SlotTraitTypeV2: TraitType = `core/v2/${CoreTraitName.Slot}` as TraitType;
const DynamicStateTrait = [
  `${CORE_VERSION}/${CoreTraitName.State}`,
  `${CORE_VERSION}/${CoreTraitName.LocalStorage}`,
];

type ComponentSpecModel = RuntimeComponent<
  any,
  any,
  Record<MethodName, MethodSchema['parameters']>,
  ReadonlyArray<StyleSlotName>,
  Record<SlotName, SlotSpec>,
  ReadonlyArray<EventName>
>;
export class ComponentModel implements IComponentModel {
  spec: ComponentSpecModel;
  id: ComponentId;
  type: ComponentType;
  properties: IFieldModel;
  children: Record<SlotName, IComponentModel[]> = {};
  parent: IComponentModel | null = null;
  parentId: ComponentId | null = null;
  parentSlot: SlotName | null = null;
  traits: ITraitModel[] = [];
  stateExample: Record<string, any> = {};
  _isDirty = false;

  constructor(
    private schema: ComponentSchema,
    private registry: RegistryInterface,
    public appModel: IAppModel
  ) {
    this.schema = schema;

    this.id = schema.id as ComponentId;
    this.type = schema.type as ComponentType;
    this.spec = this.registry.getComponentByType(this.type) as any;

    this.traits = schema.traits.map(t => new TraitModel(t, this.registry, this));
    this.genStateExample();
    this.parentId = this._slotTrait?.rawProperties.container.id;
    this.parentSlot = this._slotTrait?.rawProperties.container.slot;
    this.properties = new FieldModel(schema.properties, this, this.spec.spec.properties);
  }

  get slots() {
    return (this.spec ? Object.keys(this.spec.spec.slots) : []) as SlotName[];
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
      });
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
    return this.properties.rawValue;
  }

  get prevSibling() {
    let components: IComponentModel[];
    if (!this.parent) {
      components = this.appModel.topComponents;
    } else {
      components = this.parent.children[this.parentSlot!];
    }
    const index = components.indexOf(this);
    if (index === 0) return null;
    return components[index - 1];
  }

  get nextSibling() {
    let components: IComponentModel[];
    if (!this.parent) {
      components = this.appModel.topComponents;
    } else {
      components = this.parent.children[this.parentSlot!];
    }
    const index = components.indexOf(this);
    if (index === components.length - 1) return null;
    return components[index + 1];
  }

  get _slotTrait() {
    return (
      this.traits.find(t => t.type === SlotTraitType || t.type === SlotTraitTypeV2) ||
      null
    );
  }

  get allComponents(): IComponentModel[] {
    const result: IComponentModel[] = [];
    this.traverseTree(c => {
      result.push(c);
    });
    return result;
  }

  toSchema(): ComponentSchema {
    if (this._isDirty) {
      this._isDirty = false;
      const newProperties = this.rawProperties;
      const newTraits = this.traits.map(t => t.toSchema());
      const newSchema = genComponent(
        this.registry,
        this.type,
        this.id,
        newProperties,
        newTraits
      );
      this.schema = newSchema;
    }
    return this.schema;
  }

  updateComponentProperty(propertyName: string, value: any) {
    this.properties.update({ [propertyName]: value });
    this._isDirty = true;
  }

  addTrait(traitType: TraitType, properties: Record<string, unknown>): ITraitModel {
    const traitSchema = genTrait(traitType, properties);
    const trait = new TraitModel(traitSchema, this.registry, this);
    this.traits.push(trait);
    this._isDirty = true;
    this.genStateExample();
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
      const index = slotChildren.indexOf(child);
      if (index > -1) {
        slotChildren.splice(slotChildren.indexOf(child), 1);
        child._isDirty = true;
        this._isDirty = true;
      }
    }
  }

  removeTrait(traitId: TraitId) {
    const traitIndex = this.traits.findIndex(t => t.id === traitId);
    if (traitIndex === -1) return;
    this.traits.splice(traitIndex, 1);
    this._isDirty = true;
    this.genStateExample();
  }

  changeId(newId: ComponentId) {
    const oldId = this.id;
    const isIdExist = !!this.appModel.getComponentById(newId);

    if (isIdExist) {
      throw Error(`Id ${newId} already exist`);
    }

    this.id = newId;
    for (const slot in this.children) {
      const slotChildren = this.children[slot as SlotName];

      slotChildren.forEach(child => {
        child.parentId = newId;
      });
    }
    this._isDirty = true;
    this.appModel.changeComponentMapId(oldId, newId);
    this.appModel.traverseAllFields(field => field.changeReferenceId(oldId, newId));

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
    } else {
      child.appModel.removeComponent(child.id);
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
      trait.updateProperty(property, properties[property]);
    }
    trait._isDirty = true;
    this._isDirty = true;
  }

  updateSlotTrait(parent: ComponentId, slot: SlotName) {
    if (this._slotTrait) {
      this._slotTrait.properties.update({ container: { id: parent, slot } });
      this._slotTrait._isDirty = true;
    } else {
      this.addTrait(SlotTraitTypeV2, {
        container: { id: parent, slot },
        ifCondition: true,
      });
    }
    this._isDirty = true;
  }

  removeSlotTrait() {
    if (this._slotTrait) {
      this.removeTrait(this._slotTrait.id);
    }
  }

  clone() {
    return new AppModel(
      this.allComponents.map(c => c.toSchema()),
      this.registry
    ).getComponentById(this.id)!;
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

  // should be called after changing traits length
  private genStateExample() {
    if (!this.spec) return [];
    const componentStateSpec = this.spec.spec.state;
    let _temp = generateDefaultValueFromSpec(componentStateSpec, {
      returnPlaceholderForAny: true,
      genArrayItemDefaults: true,
    }) as Record<string, any>;

    this.traits.forEach(t => {
      // if component has state trait, read state trait key and add it in
      if (DynamicStateTrait.includes(t.type)) {
        const key = t.properties.rawValue.key;
        if (typeof key === 'string') {
          _temp[key] = AnyTypePlaceholder;
        }
      } else {
        _temp = merge(
          _temp,
          generateDefaultValueFromSpec(t.spec.spec.state, {
            returnPlaceholderForAny: true,
            genArrayItemDefaults: true,
          })
        );
      }
    });
    this.stateExample = _temp;
  }
}
