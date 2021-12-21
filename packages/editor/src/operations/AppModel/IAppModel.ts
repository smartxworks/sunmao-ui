import { ApplicationComponent, ComponentTrait } from "@sunmao-ui/core";

export type ComponentId = string & {
  kind: 'componentId';
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
  json: ApplicationComponent[];
  getComponentById(id: ComponentId): IComponentModel | undefined;
  genId(type: ComponentType): ComponentId;
  // createComponent: (componentType: ComponentType, componentId: ComponentId, properties: Record<string, string>) => ApplicationComponent[];
  // createModule: (moduleId: ModuleId, moduleType: ModuleType) => IModuleModel;
  // removeComponent: (componentId: ComponentId) => ApplicationComponent[];
  // removeModule: (moduleId: ModuleId) => void;
  // findComponent: (componentId: ComponentId) => ApplicationComponent | undefined;
  // moveComponent: (fromId: ComponentId, toId: ComponentId, slot: SlotName, afterId: ComponentId) => void;

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
  get json (): ApplicationComponent;
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
  changeComponentProperty: (key: string, value: unknown) => void;
  appendTo: (slot: SlotName, parent: IComponentModel) => void;

  addTrait: (traitType: TraitType, properties: Record<string, unknown>) => ITraitModel;
  // removeTrait: (traitType: TraitType) => void;
  // modifyProperty: (propertyName: string, value: any) => void;
  // modifyId: (newId: ComponentId) => void;
}

export interface ITraitModel {
  parent: IComponentModel;
  type: TraitType;
  properties: Record<string, any>;
  propertiesMedatadata: Record<string, IFieldModel>;
  methods: MethodName[];
  stateKeys: StateKey[];
  isDirty: boolean;
  get json (): ComponentTrait;
}

export interface IFieldModel {
  value: any;
  isDynamic: boolean;
  update: (value: any) => void;
  // used components' id in the expression
  // refs: Array<ComponentId | ModuleId>;
}
