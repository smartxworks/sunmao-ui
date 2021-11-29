import { initSunmaoUI } from '@sunmao-ui/runtime';
import { AppStorage } from './AppStorage';
import { AppModelManager } from './operations/AppModelManager';

const ui = initSunmaoUI();

const App = ui.App;
const registry = ui.registry;
const apiService = ui.apiService;
const stateStore = ui.stateManager.store;
const appStorage = new AppStorage(registry);
const appModelManager = new AppModelManager(appStorage.components);

export {
  ui,
  App,
  registry,
  apiService,
  stateStore,
  appStorage,
  appModelManager,
};
