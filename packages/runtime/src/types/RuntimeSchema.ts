import RGL from 'react-grid-layout';
import { ApiService } from 'src/services/apiService';
import { GlobalHandlerMap } from 'src/services/handler';
import { Registry } from 'src/services/registry';
import { StateManager } from 'src/services/stateStore';
import { Application, RuntimeApplication } from '@meta-ui/core';

export type ApplicationComponent = RuntimeApplication['spec']['components'][0];

export type MetaUIServices = {
  registry: Registry;
  stateManager: StateManager;
  globalHandlerMap: GlobalHandlerMap;
  apiService: ApiService;
};

export type ComponentWrapperType = React.FC<{ id: string }>;

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
  services: MetaUIServices;
  debugStore?: boolean;
  debugEvent?: boolean;
} & ComponentParamsFromApp;

export type ImplWrapperProps = {
  component: ApplicationComponent;
  slotsMap: SlotsMap | undefined;
  targetSlot: { id: string; slot: string } | null;
  services: MetaUIServices;
  app?: RuntimeApplication;
} & ComponentParamsFromApp;

export type SlotComponentMap = Map<string, SlotsMap>;
export type SlotsMap = Map<
  string,
  Array<{
    component: React.FC;
    id: string;
  }>
>;

export type CallbackMap = Record<string, () => void>;

export type SubscribeMethods = <U>(map: {
  [K in keyof U]: (parameters: U[K]) => void;
}) => void;
export type MergeState = (partialState: any) => void;

type RuntimeFunctions = {
  mergeState: MergeState;
  subscribeMethods: SubscribeMethods;
};

export type ComponentImplementationProps = ImplWrapperProps &
  TraitResult['props'] &
  RuntimeFunctions;

export type TraitResult = {
  props: {
    data?: unknown;
    style?: Record<string, any>;
    callbackMap?: CallbackMap;
    effects?: Array<() => void>;
  } | null;
};

export type TraitImplementation<T = any> = (
  props: T &
    RuntimeFunctions & {
      componentId: string;
      services: MetaUIServices;
    }
) => TraitResult;
