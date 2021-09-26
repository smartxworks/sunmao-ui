import { stateStore } from './store';
import { genApp } from './App';
import { initRegistry } from './registry';
import { mountUtilMethods } from './util-methods';

export function InitMetaUI() {
  const registry = initRegistry();
  mountUtilMethods();

  return {
    App: genApp(registry),
    stateStore,
    registry,
  };
}
