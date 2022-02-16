import { observable, makeObservable, action, toJS } from 'mobx';
import { Application, ComponentSchema, Module, RuntimeModule } from '@sunmao-ui/core';
import { produce } from 'immer';
import { DefaultNewModule, EmptyAppSchema } from '../constants';
import { addModuleId } from '../utils/addModuleId';
import { StorageHandler } from '../types';

export class AppStorage {
  app: Application;
  modules: Module[];
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor(
    defaultApplication?: Application,
    defaultModules?: Module[],
    private storageHandler?: StorageHandler
  ) {
    this.app = defaultApplication || EmptyAppSchema;
    this.modules = defaultModules || [];

    makeObservable(this, {
      app: observable.shallow,
      modules: observable.shallow,
      setApp: action,
      setModules: action,
    });
  }

  createModule() {
    let index = this.modules.length;

    this.modules.forEach((module) => {
      if (module.metadata.name === `myModule${index}`) {
        index++;
      }
    });

    const name = `myModule${index}`;
    const newModule: RuntimeModule = {
      ...DefaultNewModule,
      parsedVersion: {
        ...DefaultNewModule.parsedVersion,
        value: name,
      },
      metadata: {
        ...DefaultNewModule.metadata,
        name,
      }
    };

    this.setModules([...this.modules, newModule]);
    this.saveModules();
  }

  removeModule(v: string, n: string) {
    this.setModules(
      this.modules.filter(
        ({ version, metadata: { name } }) => version !== v || name !== n
      )
    );
    this.saveModules();
  }

  saveComponents(
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
        this.saveApplication();
        break;
      case 'module':
        const i = this.modules.findIndex(
          m => m.version === version && m.metadata.name === name
        );
        const newModules = produce(toJS(this.modules), draft => {
          draft[i].impl = components;
        });
        this.setModules(newModules);
        this.saveModules();
        break;
    }
  }

  saveAppMetaData({ version, name }: { version: string; name: string }) {
    const newApp = produce(toJS(this.app), draft => {
      draft.metadata.name = name;
      draft.version = version;
    });
    this.setApp(newApp);
    this.saveApplication();
  }

  saveModuleMetaData(
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
    this.saveModules();
  }

  private saveApplication() {
    this.storageHandler?.onSaveApp && this.storageHandler?.onSaveApp(toJS(this.app));
  }

  private saveModules() {
    const modules = this.modules.map(addModuleId);
    this.storageHandler?.onSaveModules && this.storageHandler?.onSaveModules(modules);
  }

  setApp(app: Application) {
    this.app = app;
  }

  setModules(modules: Module[]) {
    this.modules = modules;
  }
}
