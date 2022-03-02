import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { Application, Module, Component, ComponentSchema } from '@sunmao-ui/core';
import { initSunmaoUI, Registry, StateManager } from '@sunmao-ui/runtime';
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
  eventBus: EventBusType;
  editorStore: EditorStore;
};

export type StorageHandler = {
  onSaveApp?: (app: Application) => void;
  onSaveModules?: (module: Module[]) => void;
};

export type Schema = Component<string, string, string, string>['spec']['properties'];
export type EditorSchema<WidgetOptions = Record<string, any>> = {
  defaultValue?: any;
  // widget
  widget?: string;
  widgetOptions?: WidgetOptions;
  // category
  category?: string;
  weight?: number;
  name?: string;
};

export type WidgetProps<WidgetOptions = Record<string, any>> = {
  component: ComponentSchema;
  schema: Schema & EditorSchema<WidgetOptions>;
  services: EditorServices;
  level: number;
  value: any;
  onChange: (v: any) => void;
};

export type WidgetOptions = {
  version: string;
  metadata: {
    name: string;
  };
  spec?: {
    options?: JSONSchema7;
  };
};

export type Widget<T = Record<string, any>> = WidgetOptions & {
  impl: React.FC<WidgetProps<T>>;
};
