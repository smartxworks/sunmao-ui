import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { RegistryInterface, StateManagerInterface } from '@sunmao-ui/runtime';
import { isEqual } from 'lodash';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import { ExplorerMenuTabs, ToolMenuTabs } from '../constants/enum';

import type { Metadata } from '@sunmao-ui/core';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
  spec?: {};
  metadata?: Metadata;
};

export class EditorStore {
  globalDependencies: Record<string, unknown> = {};
  components: ComponentSchema[] = [];
  // currentEditingComponents, it could be app's or module's components
  _selectedComponentId = '';
  _dragOverComponentId = '';
  hoverComponentId = '';
  explorerMenuTab = ExplorerMenuTabs.UI_TREE;
  toolMenuTab = ToolMenuTabs.INSERT;
  viewStateComponentId = '';
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

  private isDataSourceTypeCache: Record<string, boolean> = {};

  constructor(
    private eventBus: EventBusType,
    private registry: RegistryInterface,
    private stateManager: StateManagerInterface,
    public appStorage: AppStorage
  ) {
    this.globalDependencies = this.stateManager.dependencies;
    makeAutoObservable(this, {
      eleMap: false,
      components: observable.shallow,
      setComponents: action,
      setHoverComponentId: action,
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
      (target, prevTarget) => {
        if (isEqual(prevTarget, target)) {
          return;
        }

        if (target.name) {
          this.setCurrentComponentsVersion(0);
          this.setLastSavedComponentsVersion(0);
          // clear currrent components and store
          this.clearSunmaoGlobalState();
          this.eventBus.send('stateRefresh');
          this.eventBus.send('componentsRefresh', []);
          this.setComponents([]);
          setTimeout(() => {
            // set new components
            this.setSelectedComponentId(this.originComponents[0]?.id || '');
            this.setModuleDependencies(target.metadata?.exampleProperties);
            this.eventBus.send('componentsRefresh', this.originComponents);
            this.setComponents(this.originComponents);
          }, 0);
        }
      }
    );

    reaction(
      () => this.selectedComponentId,
      () => {
        if (this.selectedComponentId) {
          this.setToolMenuTab(ToolMenuTabs.INSPECT);
        }
      }
    );

    reaction(
      () => this.rawModules,
      () => {
        // Remove old modules and re-register all modules,
        this.registry.unregisterAllModules();
        this.rawModules.forEach(m => {
          const modules = createModule(m);
          this.registry.registerModule(modules, true);
        });
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

  get selectedComponentIsDataSource() {
    if (!this.selectedComponent) return false;
    return !!this.isDataSourceTypeCache[this.selectedComponent.type];
  }

  get dragOverComponentId() {
    return this._dragOverComponentId;
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

  get uiComponents(): ComponentSchema[] {
    return this.components.filter(component => {
      if (this.isDataSourceTypeCache[component.type]) return false;
      const spec = this.registry.getComponentByType(component.type);
      if (spec.metadata.isDataSource) {
        this.isDataSourceTypeCache[component.type] = true;
        return false;
      }
      return true;
    });
  }

  get dataSources(): ComponentSchema[] {
    return this.components.filter(component => {
      if (this.isDataSourceTypeCache[component.type]) return true;
      const spec = this.registry.getComponentByType(component.type);
      if (spec.metadata.isDataSource) {
        this.isDataSourceTypeCache[component.type] = true;
        return true;
      }
      return false;
    });
  }

  get dataSourceTypeCache() {
    return this.isDataSourceTypeCache;
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
    name: string,
    spec?: EditingTarget['spec'],
    metadata?: EditingTarget['metadata']
  ) => {
    this.currentEditingTarget = {
      kind,
      name,
      version,
      spec,
      metadata,
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

  setHoverComponentId = (val: string) => {
    this.hoverComponentId = val;
  };

  setCurrentComponentsVersion = (val: number) => {
    this.currentComponentsVersion = val;
  };

  setLastSavedComponentsVersion = (val: number) => {
    this.lastSavedComponentsVersion = val;
  };

  setExplorerMenuTab = (val: ExplorerMenuTabs) => {
    this.explorerMenuTab = val;
  };

  setViewStateComponentId = (val: string) => {
    this.viewStateComponentId = val;
  };

  setToolMenuTab = (val: ToolMenuTabs) => {
    this.toolMenuTab = val;
  };

  setIsDraggingNewComponent = (val: boolean) => {
    this.isDraggingNewComponent = val;
  };

  setModuleDependencies = (exampleProperties?: Record<string, unknown>) => {
    const evaledDependencies = this.stateManager.deepEval(exampleProperties || {}, {
      fallbackWhenError: () => undefined,
    });

    this.stateManager.setDependencies({
      ...this.globalDependencies,
      ...evaledDependencies,
    });
  };
}
