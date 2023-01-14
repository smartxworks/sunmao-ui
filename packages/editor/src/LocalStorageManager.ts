import { Application, Module } from '@sunmao-ui/core';
import { EmptyAppSchema } from './constants';
import isSSR from './utils/isSSR';

export class LocalStorageManager {
  static AppLSKey = 'schema';
  static ModulesLSKey = 'modules';

  getAppFromLS(): Application {
    try {
      const appFromLS = localStorage.getItem(LocalStorageManager.AppLSKey);
      if (appFromLS) {
        return JSON.parse(appFromLS);
      }
      return EmptyAppSchema;
    } catch (error) {
      return EmptyAppSchema;
    }
  }

  getModulesFromLS(): Module[] {
    try {
      const modulesFromLS = localStorage.getItem(LocalStorageManager.ModulesLSKey);
      if (modulesFromLS) {
        return JSON.parse(modulesFromLS);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  saveAppInLS(app: Application) {
    if (!isSSR) {
      localStorage.setItem(LocalStorageManager.AppLSKey, JSON.stringify(app));
    }
  }

  saveModulesInLS(modules: Module[]) {
    if (!isSSR) {
      localStorage.setItem(LocalStorageManager.ModulesLSKey, JSON.stringify(modules));
    }
  }
}
