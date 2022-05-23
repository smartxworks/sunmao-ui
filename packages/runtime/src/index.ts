import { StateManager } from './services/StateManager';
import { genApp } from './App';
import { initRegistry, SunmaoLib } from './services/Registry';
import { initApiService } from './services/apiService';
import { initGlobalHandlerMap } from './services/handler';
import { UtilMethodManager } from './services/UtilMethodManager';
import { AppHooks } from './types';
import { enableES5, setAutoFreeze } from 'immer';
import './style.css';

// immer would make some errors when read the states, so we do these to avoid it temporarily
// ref: https://github.com/immerjs/immer/issues/916
enableES5();
setAutoFreeze(false);

export type SunmaoUIRuntimeProps = {
  libs?: SunmaoLib[];
  dependencies?: Record<string, any>;
  hooks?: AppHooks;
};

export function initSunmaoUI(props: SunmaoUIRuntimeProps = {}) {
  const stateManager = new StateManager(props.dependencies);
  const globalHandlerMap = initGlobalHandlerMap();
  const apiService = initApiService();
  const utilMethodManager = new UtilMethodManager(apiService);
  const eleMap = new Map<string, HTMLElement>();
  const registry = initRegistry(
    {
      stateManager,
      globalHandlerMap,
      apiService,
      eleMap,
    },
    utilMethodManager
  );
  const hooks = props.hooks;

  props.libs?.forEach(lib => {
    registry.installLib(lib);
  });

  return {
    App: genApp(
      {
        registry,
        stateManager,
        globalHandlerMap,
        apiService,
        eleMap,
      },
      hooks
    ),
    stateManager,
    registry,
    globalHandlerMap,
    apiService,
    eleMap,
  };
}

export * from './utils/buildKit';
export * from './types';
export * from './constants';
export * from './traits/core';
export type { RegistryInterface, SunmaoLib } from './services/Registry';
export { ExpressionError } from './services/StateManager';
export type { StateManagerInterface } from './services/StateManager';
export { ModuleRenderer } from './components/_internal/ModuleRenderer';
export { default as Text, TextPropertySpec } from './components/_internal/Text';

// TODO: check this export
export { watch } from './utils/watchReactivity';
