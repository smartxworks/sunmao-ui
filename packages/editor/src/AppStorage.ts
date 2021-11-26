import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ImplementedRuntimeModule, Registry } from '@sunmao-ui/runtime';
import { produce } from 'immer';
import { eventBus } from './eventBus';
import { DefaultNewModule, EmptyAppSchema } from './constants';

// function module2App(module: ImplementedRuntimeModule): Application {
//   return {
//     version: module.version,
//     kind: 'Application',
//     metadata: module.metadata,
//     spec: {
//       components: module.components,
//     },
//     moduleSpec: module.spec,
//   } as Application;
// }

// function app2Module(app: Application): ImplementedRuntimeModule {
//   return {
//     version: app.version,
//     kind: 'Module',
//     metadata: app.metadata,
//     components: app.spec.components,
//     parsedVersion: {
//       category: app.version,
//       value: app.metadata.name,
//     },
//     spec: (app as any).moduleSpec,
//   };
// }

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
    this.modules = this.getModulesFromLS();
    this.updateCurrentId('app', this.app.metadata.name);
    this.refreshComponents();

    eventBus.on('componentsChange', (components: ApplicationComponent[]) => {
      this.components = components;
      this.saveInLS();
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
      console.warn(error);
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
    console.log('updateCurrentId', type, name);
    this.refreshComponents();
  }

  createModule() {
    this.modules.push(DefaultNewModule);
    this.saveModulesInLS();
  }

  saveInLS() {
    console.log('saveInLS', this.components);
    switch (this.currentEditingType) {
      case 'app':
        const newApp = produce(this.app, draft => {
          draft.spec.components = this.components;
        });
        this.app = newApp;
        this.saveAppInLS();
        break;
      case 'module':
        const i = this.modules.findIndex(
          m => m.metadata.name === this.currentEditingName
        );
        const newModules = produce(this.modules, draft => {
          draft[i].components = this.components;
        });
        console.log('newModules', newModules);
        this.modules = newModules;
        this.saveModulesInLS();
        break;
    }
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

        console.log('componentsOfModule', componentsOfModule);
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
