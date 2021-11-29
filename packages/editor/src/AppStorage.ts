import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ImplementedRuntimeModule, Registry } from '@sunmao-ui/runtime';
import { produce } from 'immer';
import { eventBus } from './eventBus';
import { DefaultNewModule, EmptyAppSchema } from './constants';

export class AppStorage {
  components: ApplicationComponent[] = [];
  app: Application;
  modules: ImplementedRuntimeModule[];
  // this is current editing Model
  private currentEditingName: string | undefined;
  private currentEditingType: 'app' | 'module' = 'app';
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor(private registry: Registry) {
    this.app = this.getDefaultAppFromLS();
    this.setApp(this.app)
    this.modules = this.getModulesFromLS();
    this.setModules(this.modules)
  
    this.updateCurrentId('app', this.app.metadata.name);
    this.refreshComponents();

    eventBus.on('componentsChange', (components: ApplicationComponent[]) => {
      this.components = components;
      this.saveComponentsInLS();
    });
  }

  getDefaultAppFromLS(): Application {
    try {
      const appFromLS = localStorage.getItem(AppStorage.AppLSKey);
      if (appFromLS) {
        return JSON.parse(appFromLS);
      }
      return EmptyAppSchema;
    } catch (error) {
      return EmptyAppSchema;
    }
  }

  getModulesFromLS(): ImplementedRuntimeModule[] {
    try {
      const modulesFromLS = localStorage.getItem(AppStorage.ModulesLSKey);
      if (modulesFromLS) {
        return JSON.parse(modulesFromLS);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  updateCurrentId(type: 'app' | 'module', name: string) {
    this.currentEditingType = type;
    this.currentEditingName = name;
    this.refreshComponents();
  }

  createModule() {
    this.setModules([...this.modules, DefaultNewModule]);
    this.saveModulesInLS();
  }

  removeModule(module: ImplementedRuntimeModule) {
    this.setModules(this.modules.filter(m => m !== module));
    this.saveModulesInLS();
  }

  saveComponentsInLS() {
    switch (this.currentEditingType) {
      case 'app':
        const newApp = produce(this.app, draft => {
          draft.spec.components = this.components;
        });
        this.setApp(newApp);
        this.saveAppInLS();
        break;
      case 'module':
        const i = this.modules.findIndex(
          m => m.metadata.name === this.currentEditingName
        );
        const newModules = produce(this.modules, draft => {
          draft[i].components = this.components;
        });
        this.setModules(newModules);
        this.saveModulesInLS();
        break;
    }
  }

  private setApp(app: Application) {
    this.app = app;
    eventBus.send('appChange', app);
  }

  private setModules(modules: ImplementedRuntimeModule[]) {
    this.modules = modules;
    eventBus.send('modulesChange', modules);
  }

  private saveAppInLS() {
    localStorage.setItem(AppStorage.AppLSKey, JSON.stringify(this.app));
  }

  private saveModulesInLS() {
    localStorage.setItem(AppStorage.ModulesLSKey, JSON.stringify(this.modules));
    // reregister modules to activate immediately
    this.modules.forEach(m => this.registry.registerModule(m, true));
  }

  // update components by currentEditingType & cache
  private refreshComponents() {
    switch (this.currentEditingType) {
      case 'module':
        const module = this.modules.find(
          m => m.metadata.name === this.currentEditingName
        );
        const componentsOfModule = module?.components || [];
        this.components = componentsOfModule;

        break;
      case 'app':
        const componentsOfApp = this.app.spec.components;
        this.components = componentsOfApp;
        break;
    }
    this.emitComponentsChange();
  }

  private emitComponentsChange() {
    eventBus.send('componentsReload', this.components);
  }
}
