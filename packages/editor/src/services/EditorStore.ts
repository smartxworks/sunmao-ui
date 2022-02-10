import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { Registry, StateManager, parseTypeBox } from '@sunmao-ui/runtime';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import { SchemaValidator } from '../validator';
import { removeModuleId } from '../utils/addModuleId';
import { DataSourceType } from '../components/DataSource';
import { TSchema } from '@sinclair/typebox';
import { genOperation } from '../operations';

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
  // current editor editing target(app or module)
  currentEditingTarget: EditingTarget = {
    kind: 'app',
    version: '',
    name: '',
  };

  // when componentsChange event is triggered, currentComponentsVersion++
  currentComponentsVersion = 0;
  lastSavedComponentsVersion = 0;
  schemaValidator: SchemaValidator;

  // data source
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

  setActiveDataSource = (dataSource: ComponentSchema | null) => {
    this.activeDataSource = dataSource;
  };

  setActiveDataSourceType = (dataSourceType: DataSourceType | null) => {
    this.activeDataSourceType = dataSourceType;
  };

  getDataSources = () => {
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
  };

  createDataSource = (type: DataSourceType) => {
    const { apis, states } = this.getDataSources();
    const id =
      type === DataSourceType.API ? `api${apis.length}` : `state${states.length}`;
    const traitType = type === DataSourceType.API ? 'core/v1/fetch' : 'core/v1/state';
    const traitSpec = this.registry.getTraitByType(traitType).spec;
    const initProperties = parseTypeBox(traitSpec.properties as TSchema);

    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'createComponent', {
        componentType: 'core/v1/dummy',
        componentId: id,
      })
    );
    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'createTrait', {
        componentId: id,
        traitType: traitType,
        properties:
          type === DataSourceType.API
            ? {
                ...initProperties,
                method: 'get',
              }
            : initProperties,
      })
    );

    const component = this.components.find(({ id: componentId }) => id === componentId);

    this.setActiveDataSource(component!);
    this.setActiveDataSourceType(type);
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
}
