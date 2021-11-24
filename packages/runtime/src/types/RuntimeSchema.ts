import RGL from 'react-grid-layout';
import { ApiService } from 'src/services/apiService';
import { GlobalHandlerMap } from 'src/services/handler';
import { Registry } from 'src/services/registry';
import { StateManager } from 'src/services/stateStore';
import { Application, RuntimeApplication } from '@sunmao-ui/core';
import { EventHandlerSchema } from './TraitPropertiesSchema';
import { Type } from '@sinclair/typebox';

export type RuntimeApplicationComponent = RuntimeApplication['spec']['components'][0];

export type UIServices = {
  registry: Registry;
  stateManager: StateManager;
  globalHandlerMap: GlobalHandlerMap;
  apiService: ApiService;
};

export type ComponentWrapperProps = {
  parentType: string;
  component: RuntimeApplicationComponent;
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

export type ImplWrapperProps = {
  component: RuntimeApplicationComponent;
  slotsMap: SlotsMap | undefined;
  targetSlot: { id: string; slot: string } | null;
  services: UIServices;
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
    customStyle?: Record<string, string>;
    callbackMap?: CallbackMap;
    effects?: Array<() => void>;
  } | null;
  unmount?: boolean;
};

export type TraitImplementation<T = any> = (
  props: T &
    RuntimeFunctions & {
      componentId: string;
      services: UIServices;
    }
) => TraitResult;

export const RuntimeModuleSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  properties: Type.Record(Type.String(), Type.Any()),
  handlers: Type.Array(EventHandlerSchema),
});
