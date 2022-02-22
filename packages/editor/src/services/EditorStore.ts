import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { Registry, StateManager } from '@sunmao-ui/runtime';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import { SchemaValidator } from '../validator';
import { removeModuleId } from '../utils/addModuleId';
import { DataSourceType } from '../components/DataSource';
import { genOperation } from '../operations';
import { ExplorerMenuTabs, ToolMenuTabs } from './enum';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
};
type DataSources = {
  apis: ComponentSchema[];
  states: ComponentSchema[];
};

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
  activeDataSource: ComponentSchema | null = null;
  activeDataSourceType: DataSourceType | null = null;

  constructor(
    private eventBus: EventBusType,
    private registry: Registry,
    private stateManager: StateManager,
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

          if (this.APICount === -1 || this.stateCount === -1) {
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
        if (module) {
          return removeModuleId(module).impl;
        }
        return [];
      case 'app':
        return this.app.spec.components;
    }
  }

  get dataSources(): DataSources {
    const apis: ComponentSchema[] = [];
    const states: ComponentSchema[] = [];

    this.components.forEach(component => {
      if (component.type === 'core/v1/dummy') {
        component.traits.forEach(trait => {
          if (trait.type === 'core/v1/fetch') {
            apis.push(component);
          }

          if (trait.type === 'core/v1/state') {
            states.push(component);
          }
        });
      }
    });

    return { apis, states };
  }

  clearSunmaoGlobalState() {
    this.stateManager.clear();
    // reregister all modules
    this.modules.forEach(m => {
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
    const { apis, states } = this.dataSources;

    this.APICount = apis.length;
    this.stateCount = states.length;
  };

  setActiveDataSource = (dataSource: ComponentSchema | null) => {
    this.activeDataSource = dataSource;
  };

  setActiveDataSourceType = (dataSourceType: DataSourceType | null) => {
    this.activeDataSourceType = dataSourceType;
  };

  createDataSource = (type: DataSourceType) => {
    const { apis, states } = this.dataSources;
    const isAPI = type === DataSourceType.API;
    const ids = isAPI ? apis.map(({ id }) => id) : states.map(({ id }) => id);

    while (
      isAPI
        ? ids.includes(`api${this.APICount}`)
        : ids.includes(`state${this.stateCount}`)
    ) {
      if (isAPI) {
        this.APICount++;
      } else {
        this.stateCount++;
      }
    }

    const id = isAPI ? `api${this.APICount++}` : `state${this.stateCount++}`;

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

    if (type === DataSourceType.STATE) {
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
