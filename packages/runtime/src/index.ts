import { initStateManager } from './services/stateStore';
import { genApp } from './App';
import { initRegistry } from './services/registry';
import { initApiService } from './services/apiService';
import { mountUtilMethods } from './services/util-methods';
import { initGlobalHandlerMap } from './services/handler';

export function initMetaUI() {
  const registry = initRegistry();
  const stateManager = initStateManager();
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
export * from './utils/encodeDragDataTransfer';
export * from './types/RuntimeSchema';
export * from './constants';
