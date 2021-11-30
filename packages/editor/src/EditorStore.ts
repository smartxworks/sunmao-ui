import { makeAutoObservable, autorun, observable } from 'mobx';
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
  // name is `${module.version}/${module.metadata.name}`
  currentEditingName: string = '';
  currentEditingType: 'app' | 'module' = 'app';
  app: Application;

  appStorage = new AppStorage();

  constructor() {
    makeAutoObservable(this, {
      components: observable.shallow,
      app: observable.shallow,
      modules: observable.shallow,
    });
    this.app = this.appStorage.app;
    this.modules = this.appStorage.modules;
    this.setApp(this.appStorage.app);
    this.setModules(this.appStorage.modules);

    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    eventBus.on('appChange', app => {
      this.setApp(app);
    });
    eventBus.on('modulesChange', modules => {
      this.setModules(modules);
      // reregister modules to activate immediately
      this.modules.forEach(m => registry.registerModule(m, true));
    });
    // listen the change by operations, and save newComponents
    eventBus.on('componentsChange', components => {
      this.setComponents(components);
      this.appStorage.saveComponentsInLS(
        this.currentEditingType,
        this.currentEditingName,
        components
      );
    });
    
    autorun(() => {
      console.log('componentsReload', this.originComponents)
      eventBus.send('componentsReload', this.originComponents)
      this.setComponents(this.originComponents);
    })
  }

  // init components of app of module
  get originComponents(): ApplicationComponent[] {
    switch (this.currentEditingType) {
      case 'module':
        const module = this.modules.find(
          m => m.metadata.name === this.currentEditingName
        );
        return module?.components || [];
      case 'app':
        console.log('this.app', this.app)
        return this.app.spec.components;
    }
  }

  updateCurrentEditingTarget = (type: 'app' | 'module', name: string) => {
    this.setCurrentEditingType(type);
    this.setCurrentEditingName(name);
  };

  setSelectedComponentId(val: string) {
    this.selectedComponentId = val;
  }
  private setCurrentEditingName(val: string) {
    this.currentEditingName = val;
  }
  private setCurrentEditingType(val: 'app' | 'module') {
    this.currentEditingType = val;
  }
  private setComponents(val: ApplicationComponent[]) {
    this.components = val;
  }
  private setModules(val: ImplementedRuntimeModule[]) {
    this.modules = val;
  }
  private setApp(val: Application) {
    this.app = val;
  }
}

export const editorStore = new EditorStore();
