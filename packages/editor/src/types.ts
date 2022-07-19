import { Application, Module } from '@sunmao-ui/core';
import {
  initSunmaoUI,
  RegistryInterface,
  StateManagerInterface,
} from '@sunmao-ui/runtime';
import { WidgetManager } from '@sunmao-ui/editor-sdk';
import { EditorStore } from './services/EditorStore';
import { EventBusType } from './services/eventBus';
import { AppModelManager } from './operations/AppModelManager';
import { type BatchBranchOperationContext } from './operations/branch/batch';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

export type EditorServices = {
  App: ReturnOfInit['App'];
  registry: RegistryInterface;
  apiService: ReturnOfInit['apiService'];
  stateManager: StateManagerInterface;
  appModelManager: AppModelManager;
  widgetManager: WidgetManager;
  eventBus: EventBusType;
  editorStore: EditorStore;
  doOperations: (operations: BatchBranchOperationContext['operations']) => void;
};

export type StorageHandler = {
  onSaveApp?: (app: Application) => void;
  onSaveModules?: (module: Module[]) => void;
};
