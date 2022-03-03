import { Application, Module } from '@sunmao-ui/core';
import { initSunmaoUI, Registry, StateManager } from '@sunmao-ui/runtime';
import { WidgetManager } from '@sunmao-ui/editor-sdk';
import { EditorStore } from './services/EditorStore';
import { EventBusType } from './services/eventBus';
import { AppModelManager } from './operations/AppModelManager';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

export type EditorServices = {
  App: ReturnOfInit['App'];
  registry: Registry;
  apiService: ReturnOfInit['apiService'];
  stateManager: StateManager;
  appModelManager: AppModelManager;
  widgetManager: WidgetManager;
  eventBus: EventBusType;
  editorStore: EditorStore;
};

export type StorageHandler = {
  onSaveApp?: (app: Application) => void;
  onSaveModules?: (module: Module[]) => void;
};
