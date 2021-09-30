import { initMetaUI } from '@meta-ui/runtime';

const metaUI = initMetaUI();

export const App = metaUI.App;
export const registry = metaUI.registry;
export const stateStore = metaUI.stateManager.store;
