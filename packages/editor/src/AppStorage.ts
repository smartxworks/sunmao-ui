import { observable, makeObservable, action } from 'mobx';
import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import { produce } from 'immer';
import { DefaultNewModule, EmptyAppSchema } from './constants';

export class AppStorage {
  app: Application = this.getDefaultAppFromLS();
  modules: ImplementedRuntimeModule[] = this.getModulesFromLS();
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor() {
    makeObservable(this, {
      app: observable.shallow,
      modules: observable.shallow,
      setApp: action,
      setModules: action,
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

  createModule() {
    this.setModules([...this.modules, DefaultNewModule]);
    this.saveModulesInLS();
  }

  removeModule(v: string, n: string) {
    this.setModules(
      this.modules.filter(
        ({ version, metadata: { name } }) => version !== v && name !== n
      )
    );
    this.saveModulesInLS();
  }

  saveComponentsInLS(
    type: 'app' | 'module',
    version: string,
    name: string,
    components: ApplicationComponent[]
  ) {
    switch (type) {
      case 'app':
        const newApp = produce(this.app, draft => {
          draft.spec.components = components;
        });
        this.setApp(newApp);
        this.saveAppInLS();
        break;
      case 'module':
        const i = this.modules.findIndex(
          m => m.version === version && m.metadata.name === name
        );
        const newModules = produce(this.modules, draft => {
          draft[i].components = components;
        });
        this.setModules(newModules);
        this.saveModulesInLS();
        break;
    }
  }

  private saveAppInLS() {
    localStorage.setItem(AppStorage.AppLSKey, JSON.stringify(this.app));
  }

  private saveModulesInLS() {
    localStorage.setItem(AppStorage.ModulesLSKey, JSON.stringify(this.modules));
  }

  setApp(app: Application) {
    this.app = app;
  }
  setModules(modules: ImplementedRuntimeModule[]) {
    this.modules = modules;
  }
}
