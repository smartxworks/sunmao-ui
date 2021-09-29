import { ApiService } from 'src/modules/apiService';
import { GlobalHandlerMap } from 'src/modules/handler';
import { Registry } from 'src/modules/registry';
import { StateManager } from 'src/modules/stateStore';
import { Application, RuntimeApplication } from '../../../core/lib';

export type ApplicationComponent = RuntimeApplication['spec']['components'][0];

export type MetaUIModules = {
  registry: Registry;
  stateManager: StateManager;
  globalHandlerMap: GlobalHandlerMap;
  apiService: ApiService;
};

export type ComponentWrapperType = React.FC<{ id: string }>;

export type ComponentParamsFromApp = {
  onLayoutChange?: (id: string, layout: any) => void;
  componentWrapper?: ComponentWrapperType;
};

export type AppProps = {
  options: Application;
  mModules: MetaUIModules;
  debugStore?: boolean;
  debugEvent?: boolean;
} & ComponentParamsFromApp;

export type ImplWrapperProps = {
  component: ApplicationComponent;
  slotsMap: SlotsMap | undefined;
  targetSlot: { id: string; slot: string } | null;
  mModules: MetaUIModules;
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

export type ComponentMergedProps = ImplWrapperProps &
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
      mModules: MetaUIModules;
    }
) => TraitResult;
