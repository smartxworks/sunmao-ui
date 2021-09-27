import { initStateManager } from './store';
import { genApp } from './App';
import { initRegistry } from './registry';
import { mountUtilMethods } from './util-methods';
import { initGlobalHandlerMap } from './handler';
import { initApiService } from './api-service';

export function initMetaUI() {
  const registry = initRegistry();
  const stateManager = initStateManager();
  const globalHandlerMap = initGlobalHandlerMap();
  const apiService = initApiService();
  mountUtilMethods(apiService);

  return {
    App: genApp(registry, stateManager, globalHandlerMap, apiService),
    stateManager,
    registry,
    globalHandlerMap,
    apiService,
  };
}
