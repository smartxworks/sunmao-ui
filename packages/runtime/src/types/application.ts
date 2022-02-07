import RGL from 'react-grid-layout';
import { ApiService } from '../services/apiService';
import { GlobalHandlerMap } from '../services/handler';
import { Registry } from '../services/Registry';
import { StateManager } from '../services/StateManager';
import { Application, RuntimeComponentSchema } from '@sunmao-ui/core';
import React from 'react';

export type UIServices = {
  registry: Registry;
  stateManager: StateManager;
  globalHandlerMap: GlobalHandlerMap;
  apiService: ApiService;
};

export type ComponentWrapperProps = {
  parentType: string;
  component: RuntimeComponentSchema;
};

export type ComponentWrapperType = React.FC<ComponentWrapperProps>;

export type GridCallbacks = {
  onDragStop?: (id: string, layout: RGL.Layout[]) => void;
  onDrop?: (id: string, layout: RGL.Layout[], item: RGL.Layout, event: DragEvent) => void;
};

export type ComponentParamsFromApp = {
  gridCallbacks?: GridCallbacks;
  componentWrapper?: ComponentWrapperType;
};

export type AppProps = {
  options: Application;
  services: UIServices;
  debugStore?: boolean;
  debugEvent?: boolean;
} & ComponentParamsFromApp;
