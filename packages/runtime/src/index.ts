import { StateManager } from './services/stateStore';
import { genApp } from './App';
import { initRegistry } from './services/registry';
import { initApiService } from './services/apiService';
import { mountUtilMethods } from './services/util-methods';
import { initGlobalHandlerMap } from './services/handler';
import './style.css';

export function initSunmaoUI(dependencies = {}) {
  const registry = initRegistry();
  const stateManager = new StateManager(dependencies);
  const globalHandlerMap = initGlobalHandlerMap();
  const apiService = initApiService();
  mountUtilMethods(apiService);

  return {
    App: genApp({ registry, stateManager, globalHandlerMap, apiService }),
    stateManager,
    registry,
    globalHandlerMap,
    apiService,
  };
}

export * from './utils/parseType';
export * from './utils/parseTypeBox';
export * from './utils/buildKit';
export * from './utils/encodeDragDataTransfer';
export * from './types/RuntimeSchema';
export * from './types/TraitPropertiesSchema';
export * from './constants';
export * from './services/registry';
export { default as Slot, getSlots } from './components/_internal/Slot';
export { ModuleRenderer } from './components/_internal/ModuleRenderer';
export { default as Text, TextPropertySchema } from './components/_internal/Text';

// TODO: check this export
export { watch } from './utils/watchReactivity';
