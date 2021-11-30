import { initSunmaoUI } from '@sunmao-ui/runtime';
import { AppModelManager } from './operations/AppModelManager';

const ui = initSunmaoUI();

const App = ui.App;
const registry = ui.registry;
const apiService = ui.apiService;
const stateStore = ui.stateManager.store;
const appModelManager = new AppModelManager();

export {
  ui,
  App,
  registry,
  apiService,
  stateStore,
  appModelManager,
};
