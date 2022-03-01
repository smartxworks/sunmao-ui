import RGL from 'react-grid-layout';
import { ApiService } from '../services/apiService';
import { GlobalHandlerMap } from '../services/handler';
import { Registry } from '../services/Registry';
import { StateManager } from '../services/StateManager';
import { Application } from '@sunmao-ui/core';

export type UIServices = {
  registry: Registry;
  stateManager: StateManager;
  globalHandlerMap: GlobalHandlerMap;
  apiService: ApiService;
  eleMap: Map<string, HTMLElement>;
};

export type GridCallbacks = {
  onDragStop?: (id: string, layout: RGL.Layout[]) => void;
  onDrop?: (id: string, layout: RGL.Layout[], item: RGL.Layout, event: DragEvent) => void;
};

export type ComponentParamsFromApp = {
  gridCallbacks?: GridCallbacks;
  hooks?: AppHooks;
};

export type AppProps = {
  options: Application;
  services: UIServices;
  debugStore?: boolean;
  debugEvent?: boolean;
} & ComponentParamsFromApp;

export type AppHooks = {
  // after app first render
  didMount?: () => void;
  // app updates after schema changes
  didUpdate?: () => void;
  // app updates after html elements change
  didHtmlUpdate?: () => void;
};
