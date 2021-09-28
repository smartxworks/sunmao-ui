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

export type AppProps = {
  options: Application;
  mModules: MetaUIModules;
  onLayoutChange?: (id: string, layout: any) => void;
  componentWrapper?: ComponentWrapperType;
  debugStore?: boolean;
  debugEvent?: boolean;
};

export type ComponentWrapperType = React.FC<{ id: string }>;

export type SlotComponentMap = Map<string, SlotsMap>;
export type SlotsMap = Map<
  string,
  Array<{
    component: React.FC;
    id: string;
  }>
>;
