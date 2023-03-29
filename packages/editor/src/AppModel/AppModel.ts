import { ComponentSchema, parseType } from '@sunmao-ui/core';
import { RegistryInterface } from '@sunmao-ui/runtime';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';
import { ComponentModel } from './ComponentModel';
import {
  ComponentId,
  ComponentType,
  IAppModel,
  IComponentModel,
  IFieldModel,
  ModuleId,
  SlotName,
} from './IAppModel';
import { genComponent } from './utils';
import mitt from 'mitt';
import { forEach } from 'lodash';

export class AppModel implements IAppModel {
  topComponents: IComponentModel[] = [];
  emitter: IAppModel['emitter'] = mitt();
  // modules: IModuleModel[] = [];
  private schema: ComponentSchema[] = [];
  private componentMap: Record<ComponentId, IComponentModel> = {};
  private componentsCount = 0;

  constructor(components: ComponentSchema[], private registry: RegistryInterface) {
    this.schema = components;
    this.componentsCount = components.length;
    this.resolveTree(components);
  }

  get allComponents(): IComponentModel[] {
    const result: IComponentModel[] = [];
    this.traverseTree(c => {
      result.push(c);
    });
    return result;
  }

  // get from componentMap
  get allComponentsWithOrphan(): IComponentModel[] {
    return Object.values(this.componentMap);
  }

  get moduleIds(): ModuleId[] {
    return this.allComponents
      .filter(c => c.type === `${CORE_VERSION}/${CoreComponentName.ModuleContainer}`)
      .map(c => c.properties.rawValue.id);
  }

  toSchema(): ComponentSchema[] {
    this.schema = this.allComponents.map(c => {
      return c.toSchema();
    });

    return this.schema;
  }

  appendChild(component: IComponentModel) {
    component.appModel.removeComponent(component.id);
    component.parentId = null;
    component.parentSlot = null;
    component.parent = null;
    if (component._slotTrait) {
      component.removeTrait(component._slotTrait.id);
    }
    this.topComponents.push(component);
    this.traverseTree(c => {
      this._bindComponentToModel(c);
    });
  }

  createComponent(type: ComponentType, id?: ComponentId): IComponentModel {
    const component = genComponent(this.registry, type, id || this.genId(type));
    return new ComponentModel(component, this.registry, this);
  }

  getComponentById(componentId: ComponentId): IComponentModel | undefined {
    return this.componentMap[componentId];
  }

  removeComponent(componentId: ComponentId) {
    const comp = this.componentMap[componentId];
    if (!comp) return;
    delete this.componentMap[componentId];
    if (comp.parentSlot && comp.parent) {
      const children = comp.parent.children[comp.parentSlot];
      comp.parent.children[comp.parentSlot] = children.filter(c => c !== comp);
    } else {
      this.topComponents.splice(this.topComponents.indexOf(comp), 1);
    }
  }

  changeComponentMapId(oldId: ComponentId, newId: ComponentId) {
    this.componentMap[newId] = this.componentMap[oldId];
    delete this.componentMap[oldId];
  }

  _bindComponentToModel(component: IComponentModel) {
    this.componentMap[component.id] = component;
    component.appModel = this;
  }

  genId(type: ComponentType): ComponentId {
    const { name } = parseType(type);
    const newId = `${name}${this.componentsCount++}` as ComponentId;
    if (this.allComponents.some(c => c.id === newId)) {
      return this.genId(type);
    }
    return newId;
  }

  private resolveTree(components: ComponentSchema[]) {
    const allComponents = components.map(c => {
      if (this.componentMap[c.id as ComponentId]) {
        throw new Error(`Duplicate component id: ${c.id}`);
      } else {
        const comp = new ComponentModel(c, this.registry, this);
        this.componentMap[c.id as ComponentId] = comp;
        return comp;
      }
    });

    allComponents.forEach(child => {
      if (!child.parentId || !child.parentSlot) {
        this.topComponents.push(child);
        return;
      }
      const parent = this.componentMap[child.parentId];
      if (parent && parent.slots.includes(child.parentSlot)) {
        child.parent = parent;
        if (parent.children[child.parentSlot]) {
          parent.children[child.parentSlot].push(child);
        } else {
          parent.children[child.parentSlot] = [child];
        }
      }
    });
  }

  traverseTree(cb: (c: IComponentModel) => void) {
    function traverse(root: IComponentModel) {
      cb(root);
      for (const slot in root.children) {
        root.children[slot as SlotName].forEach(child => {
          traverse(child);
        });
      }
    }
    if (this.topComponents.length) {
      this.topComponents.forEach(parent => {
        traverse(parent);
      });
    } else {
      // When all the components have slot trait, there is no topComponents.
      // Just iterate them in order.
      Object.values(this.componentMap).forEach(c => {
        cb(c);
      });
    }
  }

  traverseAllFields(cb: (f: IFieldModel) => void) {
    function traverseField(field: IFieldModel) {
      cb(field);
      const value = field.getValue();
      if (typeof value === 'object') {
        forEach(value, childField => {
          traverseField(childField);
        });
      }
    }

    this.traverseTree(c => {
      traverseField(c.properties);
      c.traits.forEach(t => {
        traverseField(t.properties);
      });
    });
  }
}
