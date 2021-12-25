import RGL from 'react-grid-layout';
import { ApiService } from '../services/apiService';
import { GlobalHandlerMap } from '../services/handler';
import { Registry } from '../services/registry';
import { StateManager } from '../services/stateStore';
import { Application, RuntimeApplication } from '@sunmao-ui/core';
import { EventHandlerSchema } from './TraitPropertiesSchema';
import { Type } from '@sinclair/typebox';
import { SlotType } from 'src/components/_internal/Slot';

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

// TODO: (type-safe), remove fallback type
export type ImplWrapperProps<KSlot extends string = string> = {
  component: RuntimeApplicationComponent;
  // TODO: (type-safe), remove slotsMap from props
  slotsMap: SlotsMap<KSlot> | undefined;
  Slot: SlotType<KSlot>;
  targetSlot: { id: string; slot: string } | null;
  services: UIServices;
  app?: RuntimeApplication;
} & ComponentParamsFromApp;

export type SlotComponentMap = Map<string, SlotsMap<string>>;
export type SlotsMap<K extends string> = Map<
  K,
  Array<{
    component: React.FC;
    id: string;
  }>
>;

export type CallbackMap<K extends string> = Record<K, () => void>;

export type SubscribeMethods<U> = (map: {
  [K in keyof U]: (parameters: U[K]) => void;
}) => void;
export type MergeState<T> = (partialState: T) => void;

type RuntimeFunctions<TState, TMethods> = {
  mergeState: MergeState<TState>;
  subscribeMethods: SubscribeMethods<TMethods>;
};

export type ComponentImplementationProps<
  TState,
  TMethods,
  KSlot extends string,
  KStyleSlot extends string,
  KEvent extends string
> = ImplWrapperProps<KSlot> &
  TraitResult<KStyleSlot, KEvent>['props'] &
  RuntimeFunctions<TState, TMethods>;

export type TraitResult<KStyleSlot extends string, KEvent extends string> = {
  props: {
    data?: unknown;
    customStyle?: Record<KStyleSlot, string>;
    callbackMap?: CallbackMap<KEvent>;
    effects?: Array<() => void>;
  } | null;
  unmount?: boolean;
};

export type TraitImplementation<T = any> = (
  props: T &
    RuntimeFunctions<unknown, unknown> & {
      componentId: string;
      services: UIServices;
    }
) => TraitResult<string, string>;

export const RuntimeModuleSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  properties: Type.Record(Type.String(), Type.Any()),
  handlers: Type.Array(EventHandlerSchema),
});
