import { initStateManager } from './store';
import { genApp } from './App';
import { initRegistry } from './registry';
import { mountUtilMethods } from './util-methods';

export function InitMetaUI() {
  const registry = initRegistry();
  const stateManager = initStateManager();
  mountUtilMethods();

  return {
    App: genApp(registry, stateManager),
    stateManager,
    registry,
  };
}
