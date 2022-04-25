import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { RegistryInterface, StateManagerInterface } from '@sunmao-ui/runtime';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import { SchemaValidator } from '../validator';
import { DataSourceType } from '../components/DataSource';
import { genOperation } from '../operations';
import { ExplorerMenuTabs, ToolMenuTabs } from '../constants/enum';

import {
  CORE_VERSION,
  DUMMY_COMPONENT_NAME,
  FETCH_TRAIT_NAME,
  STATE_TRAIT_NAME,
  LOCAL_STORAGE_TRAIT_NAME,
} from '@sunmao-ui/shared';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
};
type DataSources = {
  apis: ComponentSchema[];
  states: ComponentSchema[];
  localStorages: ComponentSchema[];
};

enum DataSourceName {
  API = 'api',
  STATE = 'state',
  LOCALSTORAGE = 'localStorage',
}

type DataSourceId = `${DataSourceName}${number}`;
export class EditorStore {
  components: ComponentSchema[] = [];
  // currentEditingComponents, it could be app's or module's components
  _selectedComponentId = '';
  _dragOverComponentId = '';
  explorerMenuTab = ExplorerMenuTabs.UI_TREE;
  toolMenuTab = ToolMenuTabs.INSERT;
  // current editor editing target(app or module)
  currentEditingTarget: EditingTarget = {
    kind: 'app',
    version: '',
    name: '',
  };

  // not observable, just reference
  eleMap = new Map<string, HTMLElement>();
  isDraggingNewComponent = false;

  // when componentsChange event is triggered, currentComponentsVersion++
  currentComponentsVersion = 0;
  lastSavedComponentsVersion = 0;
  schemaValidator: SchemaValidator;

  // data source
  private APICount = -1;
  private stateCount = -1;
  private localStorageCount = -1;
  activeDataSource: ComponentSchema | null = null;
  activeDataSourceType: DataSourceType | null = null;

  constructor(
    private eventBus: EventBusType,
    private registry: RegistryInterface,
    private stateManager: StateManagerInterface,
    public appStorage: AppStorage
  ) {
    this.schemaValidator = new SchemaValidator(this.registry);
    makeAutoObservable(this, {
      eleMap: false,
      components: observable.shallow,
      setComponents: action,
      setDragOverComponentId: action,
    });

    this.eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    // listen the change by operations, and save newComponents
    this.eventBus.on('componentsChange', components => {
      this.setComponents(components);
      this.setCurrentComponentsVersion(this.currentComponentsVersion + 1);
      this.saveCurrentComponents();
    });

    // when switch app or module, components should refresh
    reaction(
      () => this.currentEditingTarget,
      target => {
        if (target.name) {
          this.setCurrentComponentsVersion(0);
          this.setLastSavedComponentsVersion(0);
          this.clearSunmaoGlobalState();
          this.eventBus.send('componentsRefresh', this.originComponents);
          this.setComponents(this.originComponents);

          if (
            this.APICount === -1 ||
            this.stateCount === -1 ||
            this.localStorageCount === -1
          ) {
            this.initDataSourceCount();
          }
        }
      }
    );

    reaction(
      () => this.selectedComponentId,
      () => {
        if (this.selectedComponentId) {
          this.setToolMenuTab(ToolMenuTabs.INSPECT);
          this.setActiveDataSource(null);
          this.setActiveDataSourceType(null);
        }
      }
    );

    this.updateCurrentEditingTarget('app', this.app.version, this.app.metadata.name);
  }

  get app() {
    return this.appStorage.app;
  }

  get modules() {
    return this.appStorage.modules;
  }

  get rawModules() {
    return this.appStorage.rawModules;
  }

  get selectedComponent() {
    return this.components.find(c => c.id === this._selectedComponentId);
  }

  get selectedComponentId() {
    return this._selectedComponentId;
  }

  get dragOverComponentId() {
    return this._dragOverComponentId;
  }

  get validateResult() {
    return this.schemaValidator.validate(this.components);
  }

  get isSaved() {
    // return this.currentComponentsVersion === this.lastSavedComponentsVersion;
    return true;
  }

  // origin components of app of module
  // when switch app or module, components should refresh
  get originComponents(): ComponentSchema[] {
    switch (this.currentEditingTarget.kind) {
      case 'module':
        const module = this.modules.find(
          m =>
            m.version === this.currentEditingTarget.version &&
            m.metadata.name === this.currentEditingTarget.name
        );
        return module?.impl || [];
      case 'app':
        return this.app.spec.components;
    }
  }

  get dataSources(): DataSources {
    const apis: ComponentSchema[] = [];
    const states: ComponentSchema[] = [];
    const localStorages: ComponentSchema[] = [];

    this.components.forEach(component => {
      if (component.type === `${CORE_VERSION}/${DUMMY_COMPONENT_NAME}`) {
        component.traits.forEach(trait => {
          if (trait.type === `${CORE_VERSION}/${FETCH_TRAIT_NAME}`) {
            apis.push(component);
          }

          if (trait.type === `${CORE_VERSION}/${STATE_TRAIT_NAME}`) {
            states.push(component);
          }
          if (trait.type === `${CORE_VERSION}/${LOCAL_STORAGE_TRAIT_NAME}`) {
            localStorages.push(component);
          }
        });
      }
    });

    return { apis, states, localStorages };
  }

  clearSunmaoGlobalState() {
    this.stateManager.clear();
    this.setSelectedComponentId('');

    // Remove old modules and re-register all modules,
    this.registry.unregisterAllModules();
    this.rawModules.forEach(m => {
      const modules = createModule(m);
      this.registry.registerModule(modules, true);
    });
  }

  saveCurrentComponents() {
    this.appStorage.saveComponents(
      this.currentEditingTarget.kind,
      this.currentEditingTarget.version,
      this.currentEditingTarget.name,
      toJS(this.components)
    );
    this.setLastSavedComponentsVersion(this.currentComponentsVersion);
  }

  updateCurrentEditingTarget = (
    kind: 'app' | 'module',
    version: string,
    name: string
  ) => {
    this.currentEditingTarget = {
      kind,
      name,
      version,
    };
  };

  setSelectedComponentId = (val: string) => {
    this._selectedComponentId = val;
  };

  setComponents = (val: ComponentSchema[]) => {
    this.components = val;
  };

  setDragOverComponentId = (val: string) => {
    this._dragOverComponentId = val;
  };

  setCurrentComponentsVersion = (val: number) => {
    this.currentComponentsVersion = val;
  };

  setLastSavedComponentsVersion = (val: number) => {
    this.lastSavedComponentsVersion = val;
  };

  initDataSourceCount = () => {
    const { apis, states, localStorages } = this.dataSources;

    this.APICount = apis.length;
    this.stateCount = states.length;
    this.localStorageCount = localStorages.length;
  };

  setActiveDataSource = (dataSource: ComponentSchema | null) => {
    this.activeDataSource = dataSource;
  };

  setActiveDataSourceType = (dataSourceType: DataSourceType | null) => {
    this.activeDataSourceType = dataSourceType;
  };

  createDataSource = (type: DataSourceType) => {
    const { apis, states, localStorages } = this.dataSources;
    let id: DataSourceId;

    const getCount = (
      dataSource: ComponentSchema[],
      dataSourceName: DataSourceName,
      count: number
    ): number => {
      const ids = dataSource.map(({ id }) => id);
      let id: DataSourceId = `${dataSourceName}${count}`;
      while (ids.includes(id)) {
        id = `${dataSourceName}${++count}`;
      }
      return count;
    };

    switch (type) {
      case DataSourceType.API:
        this.APICount = getCount(apis, DataSourceName.API, this.APICount);
        id = `api${this.APICount}`;
        break;
      case DataSourceType.STATE:
        this.stateCount = getCount(states, DataSourceName.STATE, this.stateCount);
        id = `state${this.stateCount}`;
        break;
      case DataSourceType.LOCALSTORAGE:
        this.localStorageCount = getCount(
          localStorages,
          DataSourceName.LOCALSTORAGE,
          this.localStorageCount
        );
        id = `localStorage${this.localStorageCount}`;
        break;
    }

    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'createDataSource', {
        id,
        type,
      })
    );

    const component = this.components.find(({ id: componentId }) => id === componentId);

    this.setActiveDataSource(component!);
    this.setActiveDataSourceType(type);

    if (type === DataSourceType.STATE || type === DataSourceType.LOCALSTORAGE) {
      this.setToolMenuTab(ToolMenuTabs.INSPECT);
    }
  };

  removeDataSource = (dataSource: ComponentSchema) => {
    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'removeComponent', {
        componentId: dataSource.id,
      })
    );
    if (this.activeDataSource?.id === dataSource.id) {
      this.setActiveDataSource(null);
      this.setActiveDataSourceType(null);
    }
  };

  changeDataSourceName = (dataSource: ComponentSchema, name: string) => {
    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'modifyComponentId', {
        componentId: dataSource.id,
        newId: name,
      })
    );

    const component = this.components.find(({ id: componentId }) => componentId === name);

    this.setActiveDataSource(component!);
  };

  setExplorerMenuTab = (val: ExplorerMenuTabs) => {
    this.explorerMenuTab = val;
  };

  setToolMenuTab = (val: ToolMenuTabs) => {
    this.toolMenuTab = val;
  };

  setIsDraggingNewComponent = (val: boolean) => {
    this.isDraggingNewComponent = val;
  };
}
