import { ApplicationComponent } from '@sunmao-ui/core';
import { parseType } from '@sunmao-ui/runtime';
import { ComponentModel } from './ComponentModel';
import {
  ComponentId,
  ComponentType,
  IApplicationModel,
  IComponentModel,
  IModuleModel,
} from './IAppModel';
import { genComponent } from './utils';

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
    this.allComponents.push(component);
    this.componentMap[component.id] = component;
  }

  toJS(): ApplicationComponent[] {
    this.schema = this.allComponents.map(c => {
      return c.toJS();
    });

    return this.schema;
  }

  createComponent(type: ComponentType, id?: ComponentId): IComponentModel {
    const component = genComponent(type, id || this.genId(type));
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

  removeComponent(componentId: ComponentId) {
    const comp = this.componentMap[componentId];
    delete this.componentMap[componentId];
    this.allComponents = this.allComponents.filter(c => c !== comp);
    if (comp.parentSlot && comp.parent) {
      const children = comp.parent.children[comp.parentSlot];
      comp.parent.children[comp.parentSlot] = children.filter(c => c !== comp);
    }
  }

  private resolveTree(components: ApplicationComponent[]) {
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
}
