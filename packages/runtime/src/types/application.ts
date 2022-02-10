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
};

export type AppProps = {
  options: Application;
  services: UIServices;
  debugStore?: boolean;
  debugEvent?: boolean;
  hooks?: AppHooks;
} & ComponentParamsFromApp;

export type AppHooks = {
  didMount?: () => void;
  didUpdate?: () => void;
};
