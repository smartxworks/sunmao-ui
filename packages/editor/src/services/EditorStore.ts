import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { RegistryInterface, StateManagerInterface } from '@sunmao-ui/runtime';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import type { SchemaValidator, ValidateErrorResult } from '../validator';
import {
  DataSourceType,
  DATASOURCE_NAME_MAP,
  DATASOURCE_TRAIT_TYPE_MAP,
} from '../constants/dataSource';
import { genOperation } from '../operations';
import { ExplorerMenuTabs, ToolMenuTabs } from '../constants/enum';

import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';
import { isEqual } from 'lodash';
import { resolveApplicationComponents } from '../utils/resolveApplicationComponents';
import { AppModelManager } from '../operations/AppModelManager';
import type { Metadata } from '@sunmao-ui/core';
import { DataSourceProperties } from '../operations/branch';

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
  validateResult: ValidateErrorResult[] = [];
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
  schemaValidator?: SchemaValidator;

  // data source
  activeDataSourceId: string | null = null;

  constructor(
    private eventBus: EventBusType,
    private registry: RegistryInterface,
    private stateManager: StateManagerInterface,
    public appStorage: AppStorage,
    private appModelManager: AppModelManager
  ) {
    this.globalDependencies = this.stateManager.dependencies;
    const dependencyNames = Object.keys(this.globalDependencies);
    // dynamic load validator
    import('../validator').then(({ SchemaValidator: SchemaValidatorClass }) => {
      this.setSchemaValidator(new SchemaValidatorClass(this.registry, dependencyNames));
      // do first validation
      this.setValidateResult(
        this.schemaValidator!.validate(this.appModelManager.appModel)
      );
    });
    makeAutoObservable(this, {
      eleMap: false,
      components: observable.shallow,
      schemaValidator: observable.ref,
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
          this.clearSunmaoGlobalState();
          this.eventBus.send('stateRefresh');
          this.eventBus.send('componentsRefresh', this.originComponents);

          this.setComponents(this.originComponents);
          this.setSelectedComponentId(this.originComponents[0]?.id || '');
          this.setModuleDependencies(target.metadata?.exampleProperties);
        }
      }
    );

    reaction(
      () => this.selectedComponentId,
      () => {
        if (this.selectedComponentId) {
          this.setToolMenuTab(ToolMenuTabs.INSPECT);
          this.setActiveDataSourceId(null);
        }
      }
    );

    reaction(
      () => this.components,
      () => {
        if (this.schemaValidator) {
          this.setValidateResult(
            this.schemaValidator.validate(this.appModelManager.appModel)
          );
        }
      }
    );

    this.updateCurrentEditingTarget('app', this.app.version, this.app.metadata.name);
  }

  get resolvedComponents() {
    return resolveApplicationComponents(
      this.components.filter(c => c.type !== `${CORE_VERSION}/${CoreComponentName.Dummy}`)
    );
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

  get dataSources(): Record<string, ComponentSchema[]> {
    const dataSources: Record<string, ComponentSchema[]> = {};

    this.components.forEach(component => {
      if (component.type === `${CORE_VERSION}/${CoreComponentName.Dummy}`) {
        component.traits.forEach(trait => {
          Object.entries(DATASOURCE_TRAIT_TYPE_MAP).forEach(
            ([dataSourceType, traitType]) => {
              if (trait.type === traitType) {
                dataSources[dataSourceType] = (dataSources[dataSourceType] || []).concat(
                  component
                );
              }
            }
          );
        });
      }
    });

    return dataSources;
  }

  get activeDataSource(): ComponentSchema | null {
    return (
      this.components.find(component => component.id === this.activeDataSourceId) || null
    );
  }

  get activeDataSourceType(): DataSourceType | null {
    for (const trait of this.activeDataSource?.traits || []) {
      const [dataSourceType] =
        Object.entries(DATASOURCE_TRAIT_TYPE_MAP).find(
          ([, traitType]) => trait.type === traitType
        ) || [];

      if (dataSourceType) {
        return dataSourceType as DataSourceType;
      }
    }

    return null;
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

  setActiveDataSourceId = (dataSourceId: string | null) => {
    this.activeDataSourceId = dataSourceId;
  };

  setValidateResult = (validateResult: ValidateErrorResult[]) => {
    this.validateResult = validateResult;
  };

  createDataSource = (
    type: DataSourceType,
    defaultProperties: DataSourceProperties = {}
  ) => {
    const getCount = (
      dataSources: ComponentSchema[] = [],
      dataSourceName = ''
    ): number => {
      let count = dataSources.length;
      let id = `${dataSourceName}${count}`;
      const ids = dataSources.map(({ id }) => id);

      while (ids.includes(id)) {
        id = `${dataSourceName}${++count}`;
      }

      return count;
    };

    const id = `${DATASOURCE_NAME_MAP[type]}${getCount(
      this.dataSources[type],
      DATASOURCE_NAME_MAP[type]
    )}`;

    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'createDataSource', {
        id,
        type,
        defaultProperties,
      })
    );

    const component = this.components.find(({ id: componentId }) => id === componentId);

    this.setActiveDataSourceId(component!.id);

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
      this.setActiveDataSourceId(null);
    }
  };

  duplicateApi = (dataSource: ComponentSchema) => {
    this.createDataSource(DataSourceType.API, dataSource.traits[0].properties);
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

    this.setActiveDataSourceId(component!.id);
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

  setSchemaValidator = (val: SchemaValidator) => {
    this.schemaValidator = val;
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
