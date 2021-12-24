import { initSunmaoUI } from '@sunmao-ui/runtime';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
import { AppModelManager } from './operations/AppModelManager';

const ui = initSunmaoUI();

const App = ui.App;
const registry = ui.registry;
const apiService = ui.apiService;
const stateManager = ui.stateManager;
const appModelManager = new AppModelManager();
registry.installLib(sunmaoChakraUILib);

export {
  ui,
  App,
  registry,
  apiService,
  stateManager,
  appModelManager,
};
