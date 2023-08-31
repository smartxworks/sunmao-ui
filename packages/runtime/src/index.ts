import { StateManager } from './services/StateManager';
import { genApp } from './App';
import { initRegistry, SunmaoLib } from './services/Registry';
import { initApiService } from './services/apiService';
import { initGlobalHandlerMap } from './services/handler';
import { UtilMethodManager } from './services/UtilMethodManager';
import { AppHooks, UIServices } from './types';
import { enableES5, setAutoFreeze } from 'immer';
import './style.css';
import { initSlotReceiver } from './services/SlotReciver';
import { debugLogger, DebuggerHandler } from './services/debugger';

// immer would make some errors when read the states, so we do these to avoid it temporarily
// ref: https://github.com/immerjs/immer/issues/916
enableES5();
setAutoFreeze(false);

export type SunmaoUIRuntimeProps = {
  libs?: SunmaoLib[];
  dependencies?: Record<string, any>;
  hooks?: AppHooks;
  isInEditor?: boolean;
  debugHandler?: DebuggerHandler;
};

export function initSunmaoUI(props: SunmaoUIRuntimeProps = {}) {
  const stateManager = new StateManager(props.dependencies);
  const globalHandlerMap = initGlobalHandlerMap();
  const apiService = initApiService();
  const utilMethodManager = new UtilMethodManager(apiService);
  const eleMap = new Map<string, HTMLElement>();
  const slotReceiver = initSlotReceiver();
  const registry = initRegistry(
    {
      stateManager,
      globalHandlerMap,
      apiService,
      eleMap,
      slotReceiver,
    },
    utilMethodManager
  );

  // record debug info
  debugLogger(apiService, stateManager, props.debugHandler);

  props.libs?.forEach(lib => {
    registry.installLib(lib);
  });
  const services: UIServices = {
    registry,
    stateManager,
    globalHandlerMap,
    apiService,
    eleMap,
    slotReceiver,
  };

  (window as any).sunmaoServices = services;

  return {
    App: genApp(services, props.hooks, props.isInEditor),
    stateManager,
    registry,
    globalHandlerMap,
    apiService,
    eleMap,
    slotReceiver,
  };
}

export * from './utils/buildKit';
export * from './utils/runEventHandler';
export * from './types';
export * from './constants';
export * from './traits/core';
export type { RegistryInterface, SunmaoLib } from './services/Registry';
export { ExpressionError } from './services/StateManager';
export type { StateManagerInterface } from './services/StateManager';
export { ModuleRenderer } from './components/_internal/ModuleRenderer';
export { ImplWrapper } from './components/_internal/ImplWrapper';
export { default as Text, TextPropertySpec } from './components/_internal/Text';
export {
  // constants
  PRESET_PROPERTY_CATEGORY,
  CORE_VERSION,
  CoreComponentName,
  CoreTraitName,
  CoreWidgetName,
  StyleWidgetName,
  EXPRESSION,
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  SLOT_PROPS_EXP,
  GLOBAL_UTIL_METHOD_ID,
  GLOBAL_MODULE_ID,
  ExpressionKeywords,
  AnyTypePlaceholder,
  // specs
  EventHandlerSpec,
  EventCallBackHandlerSpec,
  ModuleRenderSpec,
  // utils
  StringUnion,
  generateDefaultValueFromSpec,
} from '@sunmao-ui/shared';
export { formatSlotKey } from './components/_internal/ImplWrapper/hooks/useSlotChildren';

// TODO: check this export
export { watch } from './utils/watchReactivity';
export { printDebugInfo, saveDebugInfoToLocalstorage } from './services/debugger';
