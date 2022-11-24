import { Application, Module } from '@sunmao-ui/core';
import { UIServices } from '@sunmao-ui/runtime';
import { WidgetManager } from '@sunmao-ui/editor-sdk';
import { EditorStore } from './services/EditorStore';
import { AppModelManager } from './operations/AppModelManager';
import { EventBusType } from './services/eventBus';

export type EditorServices = UIServices & {
  eventBus: EventBusType;
  appModelManager: AppModelManager;
  widgetManager: WidgetManager;
  editorStore: EditorStore;
};

export type StorageHandler = {
  onSaveApp?: (app: Application) => void;
  onSaveModules?: (module: Module[]) => void;
};
