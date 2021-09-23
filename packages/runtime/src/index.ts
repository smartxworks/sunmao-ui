import { stateStore } from './store';
import { App } from './App';
import { registry } from './registry';

export function InitMetaUI() {
  return {
    App,
    stateStore,
    registry,
  };
}
