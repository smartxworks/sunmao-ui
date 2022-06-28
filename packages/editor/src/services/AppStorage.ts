import { observable, makeObservable, action, toJS } from 'mobx';
import { Application, ComponentSchema, Module, RuntimeModule } from '@sunmao-ui/core';
import { produce } from 'immer';
import { DefaultNewModule, EmptyAppSchema } from '../constants';
import { addModuleId, removeModuleId } from '../utils/addModuleId';
import { StorageHandler } from '../types';
import { JSONSchema7 } from 'json-schema';

export class AppStorage {
  app: Application;
  modules: Module[];
  // modules that have {{$moduleId}}__
  rawModules: Module[];
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  constructor(
    defaultApplication?: Application,
    defaultModules?: Module[],
    private storageHandler?: StorageHandler
  ) {
    this.app = defaultApplication || EmptyAppSchema;
    this.modules = defaultModules?.map(removeModuleId) || [];
    this.rawModules = defaultModules || [];

    makeObservable(this, {
      app: observable.shallow,
      modules: observable.shallow,
      rawModules: observable.shallow,
      setApp: action,
      setModules: action,
      setRawModules: action,
    });
  }

  createModule() {
    let index = this.modules.length;

    this.modules.forEach(module => {
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
      },
    };

    this.setModules([...this.modules, newModule]);
    this.setRawModules(this.modules.map(addModuleId));
    this.saveModules();
  }

  removeModule(v: string, n: string) {
    this.setModules(
      this.modules.filter(
        ({ version, metadata: { name } }) => version !== v || name !== n
      )
    );
    this.setRawModules(this.modules.map(addModuleId));
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
        const rawModules = newModules.map(addModuleId);
        this.setRawModules(rawModules);
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
      properties,
      rawSpec,
    }: {
      version: string;
      name: string;
      stateMap: Record<string, string>;
      properties: Record<string, string>;
      rawSpec: JSONSchema7;
    }
  ) {
    const i = this.modules.findIndex(
      m => m.version === originVersion && m.metadata.name === originName
    );
    const newModules = produce(toJS(this.modules), draft => {
      draft[i].metadata.name = name;
      draft[i].spec.stateMap = stateMap;
      draft[i].spec.properties = properties;
      draft[i].rawSpec = rawSpec;
      draft[i].version = version;
    });

    this.setModules(newModules);
    const rawModules = newModules.map(addModuleId);
    this.setRawModules(rawModules);
    this.saveModules();
  }

  private saveApplication() {
    this.storageHandler?.onSaveApp && this.storageHandler?.onSaveApp(toJS(this.app));
  }

  private saveModules() {
    // save rawModules rather than modules because rawModules have {{$moduleId}}__
    this.storageHandler?.onSaveModules &&
      this.storageHandler?.onSaveModules(this.rawModules);
  }

  setApp(app: Application) {
    this.app = app;
  }

  setModules(modules: Module[]) {
    this.modules = modules;
  }

  setRawModules(modules: Module[]) {
    this.rawModules = modules;
  }
}
