import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema } from '@sunmao-ui/core';
import { eventBus } from './eventBus';
import { AppStorage } from './AppStorage';
import { registry, stateManager } from './setup';
import { SchemaValidator } from './validator';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
};

class EditorStore {
  components: ComponentSchema[] = [];
  // currentEditingComponents, it could be app's or module's components
  _selectedComponentId = '';
  _hoverComponentId = '';
  _dragOverComponentId: string = '';
  // current editor editing target(app or module)
  currentEditingTarget: EditingTarget = {
    kind: 'app',
    version: '',
    name: '',
  };
  // when componentsChange event is triggered, currentComponentsVersion++
  currentComponentsVersion = 0;
  lastSavedComponentsVersion = 0;

  appStorage = new AppStorage();
  schemaValidator = new SchemaValidator(registry);

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

  constructor() {
    makeAutoObservable(this, {
      components: observable.shallow,
      setComponents: action,
      setDragOverComponentId: action,
    });

    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    // listen the change by operations, and save newComponents
    eventBus.on('componentsChange', components => {
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
          eventBus.send('componentsRefresh', this.originComponents);
          this.setComponents(this.originComponents);
        }
      }
    );

    this.updateCurrentEditingTarget('app', this.app.version, this.app.metadata.name);
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

  clearSunmaoGlobalState() {
    stateManager.clear();
    // reregister all modules
    this.modules.forEach(m => registry.registerModule(m, true));
  }

  saveCurrentComponents() {
    this.appStorage.saveComponentsInLS(
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
}

export const editorStore = new EditorStore();
