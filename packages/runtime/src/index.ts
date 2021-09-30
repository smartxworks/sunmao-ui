import { initStateManager } from './modules/stateStore';
import { genApp } from './App';
import { initRegistry } from './modules/registry';
import { initApiService } from './modules/apiService';
import { mountUtilMethods } from './modules/util-methods';
import { initGlobalHandlerMap } from './modules/handler';

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
