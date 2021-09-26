import { initStateManager } from './store';
import { genApp } from './App';
import { initRegistry } from './registry';
import { mountUtilMethods } from './util-methods';
import { initGlobalHandlerMap } from './handler';

export function InitMetaUI() {
  const registry = initRegistry();
  const stateManager = initStateManager();
  const globalHandlerMap = initGlobalHandlerMap();
  mountUtilMethods();

  return {
    App: genApp(registry, stateManager, globalHandlerMap),
    stateManager,
    registry,
    globalHandlerMap,
  };
}
