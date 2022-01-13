import { observable, makeObservable, action, toJS } from 'mobx';
import { Application, ComponentSchema } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import { produce } from 'immer';
import { DefaultNewModule, EmptyAppSchema } from './constants';
import { addModuleId, removeModuleId } from './utils/addModuleId';
import { cloneDeep } from 'lodash-es';

export class AppStorage {
  app: Application = this.getDefaultAppFromLS();
  modules: ImplementedRuntimeModule[] = this.getModulesFromLS();
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor() {
    console.log(this.modules)
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
        return JSON.parse(modulesFromLS).map(removeModuleId);
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
    components: ComponentSchema[]
  ) {
    switch (type) {
      case 'app':
        const newApp = produce(toJS(this.app), draft => {
          draft.spec.components = components;
        });
        this.setApp(newApp);
        this.saveAppInLS();
        break;
      case 'module':
        const i = this.modules.findIndex(
          m => m.version === version && m.metadata.name === name
        );
        const newModules = produce(toJS(this.modules), draft => {
          draft[i].impl = components;
        });
        this.setModules(newModules);
        this.saveModulesInLS();
        break;
    }
  }

  saveAppMetaDataInLS({ version, name }: { version: string; name: string }) {
    const newApp = produce(toJS(this.app), draft => {
      draft.metadata.name = name;
      draft.version = version;
    });
    this.setApp(newApp);
    this.saveAppInLS();
  }

  saveModuleMetaDataInLS(
    { originName, originVersion }: { originName: string; originVersion: string },
    {
      version,
      name,
      stateMap,
    }: {
      version: string;
      name: string;
      stateMap: Record<string, string>;
    }
  ) {
    const i = this.modules.findIndex(
      m => m.version === originVersion && m.metadata.name === originName
    );
    const newModules = produce(toJS(this.modules), draft => {
      draft[i].metadata.name = name;
      draft[i].spec.stateMap = stateMap;
      draft[i].version = version;
    });
    this.setModules(newModules);
    this.saveModulesInLS();
  }

  private saveAppInLS() {
    localStorage.setItem(AppStorage.AppLSKey, JSON.stringify(this.app));
  }

  private saveModulesInLS() {
    const modules = cloneDeep(this.modules).map(addModuleId)
    localStorage.setItem(AppStorage.ModulesLSKey, JSON.stringify(modules));
  }

  setApp(app: Application) {
    this.app = app;
  }
  setModules(modules: ImplementedRuntimeModule[]) {
    this.modules = modules;
  }
}
