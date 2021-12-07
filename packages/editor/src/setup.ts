import { initSunmaoUI } from '@sunmao-ui/runtime';
import { AppModelManager } from './operations/AppModelManager';

const ui = initSunmaoUI();

const App = ui.App;
const registry = ui.registry;
const apiService = ui.apiService;
const stateManager = ui.stateManager;
const appModelManager = new AppModelManager();

export {
  ui,
  App,
  registry,
  apiService,
  stateManager,
  appModelManager,
};
