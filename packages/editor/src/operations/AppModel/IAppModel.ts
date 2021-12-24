import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';

export type ComponentId = string & {
  kind: 'componentId';
};
export type TraitId = string & {
  kind: 'traitId';
};
export type ComponentType = string & {
  kind: 'componentType';
};
export type ModuleId = string & {
  kind: 'moduleId';
};
export type ModuleType = string & {
  kind: 'moduleType';
};
export type TraitType = string & {
  kind: 'traitType';
};
export type SlotName = string & {
  kind: 'slotName';
};
export type MethodName = string & {
  kind: 'methodName';
};
export type StyleSlotName = string & {
  kind: 'styleSlotName';
};
export type StateKey = string & {
  kind: 'stateKey';
};
export type EventName = string & {
  kind: 'eventName';
};

export interface IApplicationModel {
  topComponents: IComponentModel[];
  // modules: IModuleModel[];
  allComponents: IComponentModel[];
  toSchema(): ApplicationComponent[];
  createComponent(type: ComponentType, id?: ComponentId): IComponentModel;
  getComponentById(id: ComponentId): IComponentModel | undefined;
  removeComponent(componentId: ComponentId): void;
  appendChild(component: IComponentModel): void;
  _registerComponent(component: IComponentModel): void;
}

export interface IModuleModel {
  id: ModuleId;
  type: ModuleType;
  property: Record<string, IFieldModel>;
}

export interface IComponentModel {
  appModel: IApplicationModel;
  id: ComponentId;
  type: ComponentType;
  properties: Record<string, IFieldModel>;
  children: Record<SlotName, IComponentModel[]>;
  parent: IComponentModel | null;
  parentId: ComponentId | null;
  parentSlot: SlotName | null;
  traits: ITraitModel[];
  stateKeys: StateKey[];
  slots: SlotName[];
  styleSlots: StyleSlotName[];
  methods: MethodName[];
  events: EventName[];
  allComponents: IComponentModel[];
  nextSilbing: IComponentModel | null;
  prevSilbling: IComponentModel | null;
  _isDirty: boolean;
  _slotTrait: ITraitModel | null;
  toSchema(): ApplicationComponent;
  updateComponentProperty: (property: string, value: unknown) => void;
  // move component across level
  appendTo: (parent?: IComponentModel, slot?: SlotName) => void;
  // move in same level
  moveAfter: (after: IComponentModel | null) => IComponentModel;
  // share methods
  appendChild: (component: IComponentModel, slot: SlotName) => void;
  changeId: (newId: ComponentId) => IComponentModel;
  addTrait: (traitType: TraitType, properties: Record<string, unknown>) => ITraitModel;
  removeTrait: (traitId: TraitId) => void;
  updateTraitProperties: (traitId: TraitId, properties: Record<string, unknown>) => void;
  updateSlotTrait: (parent: ComponentId, slot: SlotName) => void;
  removeChild: (child: IComponentModel) => void;
}

export interface ITraitModel {
  // trait id only exists in model, doesnt exist in schema
  id: TraitId;
  parent: IComponentModel;
  type: TraitType;
  rawProperties: Record<string, any>;
  properties: Record<string, IFieldModel>;
  methods: MethodName[];
  stateKeys: StateKey[];
  _isDirty: boolean;
  toSchema(): ComponentTrait;
  updateProperty: (key: string, value: any) => void;
}

export interface IFieldModel {
  value: any;
  isDynamic: boolean;
  update: (value: any) => void;
  // used components' id in the expression
  // refs: Array<ComponentId | ModuleId>;
}
