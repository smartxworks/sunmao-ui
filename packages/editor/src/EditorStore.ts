import { makeAutoObservable, autorun, observable } from 'mobx';
import { ApplicationComponent } from '@sunmao-ui/core';
import { eventBus } from './eventBus';
import { AppStorage } from './AppStorage';
import { registry } from './setup';

class EditorStore {
  components: ApplicationComponent[] = [];
  // currentEditingComponents, it could be app's or module's components
  selectedComponentId = '';
  hoverComponentId = '';
  // it could be app or module's name
  // name is `${module.version}/${module.metadata.name}`
  currentEditingName = '';
  currentEditingType: 'app' | 'module' = 'app';

  appStorage = new AppStorage();

  get app() {
    return this.appStorage.app;
  }

  get modules() {
    return this.appStorage.modules;
  }

  constructor() {
    makeAutoObservable(this, {
      components: observable.shallow,
    });

    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    // listen the change by operations, and save newComponents
    eventBus.on('componentsChange', components => {
      this.setComponents(components);
      this.appStorage.saveComponentsInLS(
        this.currentEditingType,
        this.currentEditingName,
        components
      );
      if (this.currentEditingType === 'module') {
        // reregister modules to activate immediately
        this.modules.forEach(m => registry.registerModule(m, true));
      }
    });

    autorun(() => {
      eventBus.send('componentsRefresh', this.originComponents);
      this.setComponents(this.originComponents);
    });
  }

  // origin components of app of module
  // when switch app or module, components should refresh
  get originComponents(): ApplicationComponent[] {
    switch (this.currentEditingType) {
      case 'module':
        const module = this.modules.find(
          m => m.metadata.name === this.currentEditingName
        );
        return module?.components || [];
      case 'app':
        return this.app.spec.components;
    }
  }

  updateCurrentEditingTarget = (type: 'app' | 'module', name: string) => {
    this.currentEditingType = type;
    this.currentEditingName = name;
  };
  setSelectedComponentId = (val: string) => {
    this.selectedComponentId = val;
  };
  setHoverComponentId = (val: string) => {
    this.hoverComponentId = val;
  };
  setComponents = (val: ApplicationComponent[]) => {
    this.components = val;
  };
}

export const editorStore = new EditorStore();
