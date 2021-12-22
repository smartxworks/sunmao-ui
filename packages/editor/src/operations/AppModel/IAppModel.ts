import { ApplicationComponent, ComponentTrait } from "@sunmao-ui/core";

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
  model: IComponentModel[];
  modules: IModuleModel[];
  allComponents: IComponentModel[];
  toJS(): ApplicationComponent[];
  createComponent(type: ComponentType, id?: ComponentId): IComponentModel
  getComponentById(id: ComponentId): IComponentModel | undefined;
  genId(type: ComponentType): ComponentId;
  removeComponent(componentId: ComponentId): void;
  updateSingleComponent(component: IComponentModel): void;
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
  isDirty: boolean;
  allComponents: IComponentModel[];
  toJS(): ApplicationComponent;
  changeComponentProperty: (key: string, value: unknown) => void;
  // move component across level
  appendTo: (parent?: IComponentModel, slot?: SlotName) => void;
  // move in same level
  moveAfter: (after: ComponentId | null) => IComponentModel;
  appendChild: (component: IComponentModel, slot: SlotName) => void;
  changeId: (newId: ComponentId) => IComponentModel;
  addTrait: (traitType: TraitType, properties: Record<string, unknown>) => ITraitModel;
  removeTrait: (traitId: TraitId) => void;
  updateTrait: (traitId: TraitId, properties: Record<string, unknown>) => void;
  updateSlotTrait: (parent: ComponentId, slot: SlotName) => void;
  nextSilbing: IComponentModel | null
  prevSilbling: IComponentModel | null
}

export interface ITraitModel {
  // trait id only exists in model, doesnt exist in schema
  id: TraitId
  parent: IComponentModel;
  type: TraitType;
  rawProperties: Record<string, any>;
  properties: Record<string, IFieldModel>;
  methods: MethodName[];
  stateKeys: StateKey[];
  isDirty: boolean;
  toJS(): ComponentTrait;
  updateProperty: (key: string, value: any) => void;
}

export interface IFieldModel {
  value: any;
  isDynamic: boolean;
  update: (value: any) => void;
  // used components' id in the expression
  // refs: Array<ComponentId | ModuleId>;
}
