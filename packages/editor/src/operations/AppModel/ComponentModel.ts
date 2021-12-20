import { ApplicationComponent, RuntimeComponentSpec } from '@sunmao-ui/core';
import { registry } from '../../setup';
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
} from './IAppModel';
import { TraitModel } from './TraitModel';

export class ComponentModel implements IComponentModel {
  private origin: ApplicationComponent;
  private spec: RuntimeComponentSpec;

  id: ComponentId;
  type: ComponentType;
  properties: Record<string, IFieldModel> = {};
  children: Record<SlotName, IComponentModel[]> = {};
  parent: IComponentModel | null = null;
  parentId: ComponentId | null = null;
  parentSlot: SlotName | null = null;
  traits: ITraitModel[] = [];

  constructor(component: ApplicationComponent) {
    this.origin = component;

    this.id = component.id as ComponentId;
    this.type = component.type as ComponentType;
    this.spec = registry.getComponentByType(this.type);

    this.traits = component.traits.map(t => new TraitModel(t, this));
    // find slot trait
    this.traits.forEach(t => {
      if (t.type === 'core/v1/slot') {
        this.parentId = t.properties.container.id;
        this.parentSlot = t.properties.container.slot;
      }
    })
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
    return [...componentStateKeys, ...traitStateKeys]
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
    return [...componentMethods, ...traitMethods]
  }

  get styleSlots() {
    return (this.spec ? this.spec.spec.styleSlots : []) as StyleSlotName[];
  }

  get json(): ApplicationComponent {
    return this.origin;
  }
}
