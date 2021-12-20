import { ApplicationComponent } from "@sunmao-ui/core";

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
  components: IComponentModel[];
  modules: IModuleModel[];
  allComponents: IComponentModel[];
  json: ApplicationComponent[];
  // createComponent: (componentType: ComponentType, componentId: ComponentId, properties: Record<string, string>) => IComponentModel;
  // createModule: (moduleId: ModuleId, moduleType: ModuleType) => IModuleModel;
  // removeComponent: (componentId: ComponentId) => void;
  // removeModule: (moduleId: ModuleId) => void;
  // findComponent: (componentId: ComponentId) => IComponentModel | undefined;
  // moveComponent: (fromId: ComponentId, toId: ComponentId, slot: SlotName, afterId: ComponentId) => void;
}

export interface IModuleModel {
  id: ModuleId;
  type: ModuleType;
  property: Record<string, IFieldModel>;
}

export interface IComponentModel {
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

  // addTrait: (traitType: TraitType, properties: Record<string, string>) => ITraitModel;
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
}

export interface IFieldModel {
  value: any;
  isDynamic: boolean;
  // used components' id in the expression
  // refs: Array<ComponentId | ModuleId>;
}
