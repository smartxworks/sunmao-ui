import { StateManager } from './services/stateStore';
import { genApp } from './App';
import { initRegistry, UtilMethod } from './services/registry';
import { initApiService } from './services/apiService';
import { initGlobalHandlerMap } from './services/handler';
import './style.css';

export type SunmaoUIRuntimeProps = {
  dependencies?: Record<string, any>;
  utilMethods?: UtilMethod[];
};

export function initSunmaoUI(props: SunmaoUIRuntimeProps = {}) {
  const stateManager = new StateManager(props.dependencies);
  const globalHandlerMap = initGlobalHandlerMap();
  const apiService = initApiService();
  const registry = initRegistry(apiService);

  return {
    App: genApp({ registry, stateManager, globalHandlerMap, apiService }),
    stateManager,
    registry,
    globalHandlerMap,
    apiService,
  };
}

export * from './utils/parseTypeBox';
export * from './utils/buildKit';
export * from './utils/encodeDragDataTransfer';
export * from './types';
export * from './types/TraitPropertiesSchema';
export * from './constants';
export * from './services/registry';
export * from './services/stateStore';
export { ModuleRenderer } from './components/_internal/ModuleRenderer';
export { default as Text, TextPropertySchema } from './components/_internal/Text';

// TODO: check this export
export { watch } from './utils/watchReactivity';
