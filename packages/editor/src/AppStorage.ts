import { observable, makeObservable, action, toJS } from 'mobx';
import { Application, ComponentSchema, Module } from '@sunmao-ui/core';
import { produce } from 'immer';
import { DefaultNewModule, EmptyAppSchema } from './constants';
import { addModuleId, removeModuleId } from './utils/addModuleId';
import { cloneDeep } from 'lodash-es';
import { StorageHandler } from './types';

export class AppStorage {
  app: Application;
  modules: Module[];
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor(
    defaultApplication?: Application,
    defaultModules?: Module[],
    private storageHanlder?: StorageHandler
  ) {
    this.app = this.getAppFromLS() || defaultApplication || EmptyAppSchema;
    this.modules = this.getModulesFromLS() || defaultModules || [];

    makeObservable(this, {
      app: observable.shallow,
      modules: observable.shallow,
      setApp: action,
      setModules: action,
    });
  }

  private getAppFromLS(): Application | void {
    try {
      const appFromLS = localStorage.getItem(AppStorage.AppLSKey);
      if (appFromLS) {
        return JSON.parse(appFromLS);
      }
    } catch (error) {
      return undefined;
    }
  }

  private getModulesFromLS(): Module[] | void {
    try {
      const modulesFromLS = localStorage.getItem(AppStorage.ModulesLSKey);
      if (modulesFromLS) {
        return JSON.parse(modulesFromLS).map(removeModuleId);
      }
    } catch (error) {
      return undefined;
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
    this.storageHanlder?.onSaveApp && this.storageHanlder?.onSaveApp(toJS(this.app));
  }

  private saveModulesInLS() {
    const modules = cloneDeep(this.modules).map(addModuleId);
    localStorage.setItem(AppStorage.ModulesLSKey, JSON.stringify(modules));
    this.storageHanlder?.onSaveModules &&
      this.storageHanlder?.onSaveModules(toJS(modules));
  }

  setApp(app: Application) {
    this.app = app;
  }
  setModules(modules: Module[]) {
    this.modules = modules;
  }
}
