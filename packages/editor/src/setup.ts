import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { initSunmaoUI } from '@sunmao-ui/runtime';
import { ChildrenMap } from './components/StructureTree';

const ui = initSunmaoUI();

const App = ui.App;
const registry = ui.registry;
const apiService = ui.apiService;
const stateStore = ui.stateManager.store;

type ApplicationInstanceContext = {
  app: Application | undefined;
  childrenMap: ChildrenMap | undefined;
  components: ApplicationComponent[];
  dataSources: ApplicationComponent[];
  selectedComponent: ApplicationComponent | undefined;
};

const ApplicationInstance = new Proxy<ApplicationInstanceContext>(
  {
    app: undefined,
    childrenMap: undefined,
    selectedComponent:undefined,
    components: [],
    dataSources: [],
  },
  {
    set<T extends keyof ApplicationInstanceContext>(
      target: ApplicationInstanceContext,
      key: T,
      data: ApplicationInstanceContext[T]
    ) {
      Reflect.set(target, key, data);
      return true;
    },
    get<T extends keyof ApplicationInstanceContext>(
      target: ApplicationInstanceContext,
      key: keyof ApplicationInstanceContext
    ): ApplicationInstanceContext[T] {
      return Reflect.get(target, key);
    },
  }
);

export { ui, App, registry, apiService, stateStore, ApplicationInstance };
