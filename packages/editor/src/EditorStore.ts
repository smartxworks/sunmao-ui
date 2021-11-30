import { makeAutoObservable } from 'mobx';
import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import { eventBus } from './eventBus';
import { AppStorage } from './AppStorage';
import { registry } from './setup';

class EditorStore {
  selectedComponentId = '';
  // currentEditingComponents, it could be app's or module's components
  components: ApplicationComponent[] = [];
  modules: ImplementedRuntimeModule[];
  // it could be app or module's name
  currentEditingName: string | undefined;
  currentEditingType: 'app' | 'module' = 'app';
  app: Application;

  appStorage = new AppStorage();

  constructor() {
    this.app = this.appStorage.app;
    this.modules = this.appStorage.modules;
    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    eventBus.on('componentsChange', components => {
      this.setComponents(components);
    });
    eventBus.on('modulesChange', modules => {
      this.setModules(modules);
      // reregister modules to activate immediately
      this.modules.forEach(m => registry.registerModule(m, true));
    });
    makeAutoObservable(this);
  }

  updateCurrentEditingTarget = (type: 'app' | 'module', name: string) => {
    this.appStorage.updateCurrentId(type, name);
    // this.setCurrentEditingType(type);
    // this.setCurrentEditingName(name);
  }

  setSelectedComponentId(val: string) {
    this.selectedComponentId = val;
  }
  private setCurrentEditingName(val: string) {
    this.currentEditingName = val;
  }
  private setCurrentEditingType(val: 'app' | 'module') {
    this.currentEditingType = val;
  }
  setComponents(val: ApplicationComponent[]) {
    this.components = val;
  }
  setModules(val: ImplementedRuntimeModule[]) {
    this.modules = val;
  }
}

export const editorStore = new EditorStore();
