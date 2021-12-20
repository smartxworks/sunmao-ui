import { ApplicationComponent } from '@sunmao-ui/core';
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
} from './IAppModel';
export class ApplicationModel implements IApplicationModel {
  components: IComponentModel[] = [];
  modules: IModuleModel[] = [];
  allComponents: IComponentModel[] = [];
  private origin: ApplicationComponent[] = [];
  private componentMap: Record<ComponentId, IComponentModel> = {};

  constructor(components: ApplicationComponent[]) {
    this.origin = components;
    this.resolveTree(components);
  }

  resolveTree(components: ApplicationComponent[]) {
    this.allComponents = components.map(c => {
      const comp = new ComponentModel(c);
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
        this.components.push(child);
      }
    });
  }

  get json(): ApplicationComponent[] {
    return this.origin;
  }
  // createComponent (
  //   componentType: ComponentType,
  //   componentId: ComponentId,
  //   properties: Record<string, string>
  // ) {
  //   return
  // }
  // createModule: (moduleId: ModuleId, moduleType: ModuleType) => IModuleModel;
  // removeComponent: (componentId: ComponentId) => void;
  // removeModule: (moduleId: ModuleId) => void;
  // findComponent: (componentId: ComponentId) => IComponentModel | undefined;
  // moveComponent: (
  //   fromId: ComponentId,
  //   toId: ComponentId,
  //   slot: SlotName,
  //   afterId: ComponentId
  // ) => void;
}
