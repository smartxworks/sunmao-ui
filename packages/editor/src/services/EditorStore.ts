import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { Registry, StateManager } from '@sunmao-ui/runtime';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import { SchemaValidator } from '../validator';
import { removeModuleId } from '../utils/addModuleId';
import { ExplorerMenuTabs, ToolMenuTabs } from './enum';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
};

export class EditorStore {
  components: ComponentSchema[] = [];
  // currentEditingComponents, it could be app's or module's components
  _selectedComponentId = '';
  _hoverComponentId = '';
  _dragOverComponentId = '';
  explorerMenuTab = ExplorerMenuTabs.EXPLORER;
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

      if (this.validateResult.length === 0) {
        this.saveCurrentComponents();
      }
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
        }
      }
    );

    reaction(
      () => this.selectedComponentId,
      () => {
        this.setToolMenuTab(ToolMenuTabs.INSPECT);
      });

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

  // to avoid get out-of-dated value here, we should use getter to lazy load primitive type
  get hoverComponentId() {
    return this._hoverComponentId;
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
    return this.currentComponentsVersion === this.lastSavedComponentsVersion;
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

  setHoverComponentId = (val: string) => {
    this._hoverComponentId = val;
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

  setExplorerMenuTab = (val: ExplorerMenuTabs) => {
    this.explorerMenuTab = val;
  }

  setToolMenuTab = (val: ToolMenuTabs) => {
    this.toolMenuTab = val;
  }

  setIsDraggingNewComponent = (val: boolean) => {
    this.isDraggingNewComponent = val;
  };
}
