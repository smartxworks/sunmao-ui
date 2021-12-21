import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { parseType } from '@sunmao-ui/runtime';
import produce from 'immer';
import { registry } from '../../setup';
import { ComponentModel } from './ComponentModel';
import {
  ComponentId,
  ComponentType,
  IApplicationModel,
  IComponentModel,
  IModuleModel,
  ModuleId,
  ModuleType,
  SlotName,
  TraitType,
} from './IAppModel';
import { genComponent } from './utils';

const SlotTraitType: TraitType = 'core/v1/slot' as TraitType;
export class ApplicationModel implements IApplicationModel {
  model: IComponentModel[] = [];
  modules: IModuleModel[] = [];
  allComponents: IComponentModel[] = [];
  private schema: ApplicationComponent[] = [];
  private componentMap: Record<ComponentId, IComponentModel> = {};

  constructor(components: ApplicationComponent[]) {
    this.schema = components;
    this.resolveTree(components);
  }

  updateSingleComponent(component: IComponentModel) {
    this.componentMap[component.id] = component;
    this.allComponents.push(component);
  }

  resolveTree(components: ApplicationComponent[]) {
    this.allComponents = components.map(c => {
      const comp = new ComponentModel(this, c);
      this.componentMap[c.id as ComponentId] = comp;
      return comp;
    });

    this.allComponents.forEach(child => {
      if (child.parentId && child.parentSlot) {
        const parent = this.componentMap[child.parentId];
        if (parent) {
          if (parent.children[child.parentSlot]) {
            parent.children[child.parentSlot].push(child);
          } else {
            parent.children[child.parentSlot] = [child];
          }
        }
        child.parent = parent;
      } else {
        this.model.push(child);
      }
    });
  }

  get json(): ApplicationComponent[] {
    // if (this.allComponents.length !== this.schema.length) {
    //   return this.allComponents.map(c => c.json);
    // }

    // if (this.allComponents.some(c => c.isDirty)) {
    //   return this.allComponents.map(c => c.json);
    // }

    // for (let i = 0; i < this.schema.length - 1; i++) {
    //   const comp = this.schema[i];
    //   const component = this.componentMap[comp.id as ComponentId];
    //   if (component.isDirty) {
    //     this.schema.splice(i + 1, 1, component.json);
    //   }
    // }

    this.schema = this.allComponents.map(c => {
      return c.json;
    });

    return this.schema;
  }

  createComponent(type: ComponentType): IComponentModel {
    const component = genComponent(type, this.genId(type), {}, []);
    return new ComponentModel(this, component);
  }

  genId(type: ComponentType): ComponentId {
    const { name } = parseType(type);
    const componentsCount = this.allComponents.filter(
      component => component.type === type
    ).length;
    return `${name}${componentsCount + 1}` as ComponentId;
  }

  getComponentById(componentId: ComponentId): IComponentModel | undefined {
    return this.componentMap[componentId];
  }

  findComponentIndex(componentId: ComponentId): number {
    return this.schema.findIndex(c => c.id === componentId);
  }

  private updateSchema(schema: ApplicationComponent[]) {
    this.schema = schema;
    this.model = [];
    this.allComponents = [];
    this.componentMap = {};
    this.resolveTree(schema);
  }

  // createComponent(
  //   componentType: ComponentType,
  //   componentId: ComponentId,
  //   properties: Record<string, string>
  // ) {
  //   const component = genComponent(componentType, componentId, properties);
  //   const newSchema = produce(this.schema, draft => {
  //     draft.push(component);
  //   });
  //   this.updateSchema(newSchema);
  //   return newSchema;
  // }

  removeComponent(componentId: ComponentId) {
    const newSchema = this.schema.filter(c => c.id !== componentId);
    this.updateSchema(newSchema);
    return newSchema;
  }
  // createModule: (moduleId: ModuleId, moduleType: ModuleType) => IModuleModel;
  // removeModule: (moduleId: ModuleId) => void;
  moveComponent(
    fromId: ComponentId,
    toId: ComponentId,
    slot: SlotName,
    afterId?: ComponentId
  ) {
    const fromIndex = this.findComponentIndex(fromId);
    const afterIndex = afterId
      ? this.findComponentIndex(afterId)
      : this.findComponentIndex(toId);
    this.changeTraitProperties(fromId, SlotTraitType, { container: { id: toId, slot } });

    const newSchema = produce(this.schema, draft => {
      const target = draft.splice(fromIndex, 1)[0];
      draft.splice(fromIndex >= afterIndex ? afterIndex + 1 : afterIndex, 0, target);
    });
    this.updateSchema(newSchema);
    return this.schema;
  }

  changeTraitProperties(
    componentId: ComponentId,
    traitType: TraitType,
    properties: Record<string, unknown>
  ) {
    const componentIndex = this.findComponentIndex(componentId);
    const component = this.schema[componentIndex];
    const traitIndex = component?.traits.findIndex(t => t.type === traitType);
    if (traitIndex > -1) {
      const newSchema = produce(this.schema, draft => {
        draft[componentIndex].traits[traitIndex].properties = properties;
      });
      this.updateSchema(newSchema);
    }
    return this.schema;
  }
}
