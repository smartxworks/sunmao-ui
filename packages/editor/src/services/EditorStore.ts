import { action, makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { ComponentSchema, createModule } from '@sunmao-ui/core';
import { RegistryInterface, StateManagerInterface } from '@sunmao-ui/runtime';
import { EventHandlerSpec, GLOBAL_MODULE_ID } from '@sunmao-ui/shared';

import { EventBusType } from './eventBus';
import { AppStorage } from './AppStorage';
import type { SchemaValidator, ValidateErrorResult } from '../validator';
import { ExplorerMenuTabs, ToolMenuTabs } from '../constants/enum';

import { isEqual, set } from 'lodash';
import { AppModelManager } from '../operations/AppModelManager';
import type { Metadata } from '@sunmao-ui/core';
import { ComponentId } from '../AppModel/IAppModel';
import { genOperation } from '../operations';
import { InsideMethodRelation } from '../components/ExtractModuleModal/ExtractModuleView';
import { Static } from '@sinclair/typebox';
import { OutsideExpRelationWithState } from '../components/ExtractModuleModal';

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

  private isDataSourceTypeCache: Record<string, boolean> = {};

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
        }
      }
    );

    reaction(
      () => this.rawModules,
      () => {
        // Remove old modules and re-register all modules,
        console.log('rawmodules变了', this.rawModules);
        this.registry.unregisterAllModules();
        this.rawModules.forEach(m => {
          const modules = createModule(m);
          this.registry.registerModule(modules, true);
        });
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

  extractModules(props: {
    id: string;
    properties: Record<string, string>;
    toMoveComponentIds: string[];
    moduleName: string;
    moduleVersion: string;
    methodRelations: InsideMethodRelation[];
    outsideExpRelations: OutsideExpRelationWithState[];
  }) {
    const {
      id,
      properties,
      toMoveComponentIds,
      moduleName,
      moduleVersion,
      methodRelations,
      outsideExpRelations,
    } = props;
    const root = this.appModelManager.appModel
      .getComponentById(id as ComponentId)!
      .clone();
    console.log('toMoveComponentIds', toMoveComponentIds);
    console.log('properties', properties);
    const newModuleContainerId = `${id}__module`;
    const newModuleId = `${id}Module`;
    const propertySpec: Record<string, any> = {
      type: 'object',
      properties: { ...properties },
    };
    const eventSpec: string[] = [];
    for (const key in propertySpec.properties) {
      propertySpec.properties[key] = {};
    }
    root.removeSlotTrait();
    // 转换module内的组件
    const moduleComponents = root?.allComponents.map(c => {
      const eventTrait = c.traits.find(t => t.type === 'core/v1/event');
      // 给module内组件添加module Event
      if (eventTrait) {
        const cache: Record<string, boolean> = {};
        const handlers: Static<typeof EventHandlerSpec>[] = [];
        eventTrait?.rawProperties.handlers.forEach(
          (h: Static<typeof EventHandlerSpec>) => {
            const newEventName = `${c.id}${h.type}`;
            const hasRelation = methodRelations.find(r => {
              return (
                r.source === c.id && r.event === h.type && r.target === h.componentId
              );
            });
            if (hasRelation) {
              // 如果同样的module event已经发出$module了，那就不需要它了
              if (cache[newEventName]) {
                return;
              }
              // 发出新的module event
              cache[newEventName] = true;
              eventSpec.push(newEventName);
              handlers.push({
                type: h.type,
                componentId: GLOBAL_MODULE_ID,
                method: {
                  name: newEventName,
                  parameters: {
                    moduleId: '{{$moduleId}}',
                  },
                },
                disabled: false,
                wait: { type: 'delay', time: 0 },
              });
            } else {
              handlers.push(h);
            }
          }
        );
        eventTrait.updateProperty('handlers', handlers);
      }
      return c.toSchema();
    });
    // 添加额外塞进来的组件
    if (toMoveComponentIds.length) {
      toMoveComponentIds.forEach(id => {
        const comp = this.appModelManager.appModel.getComponentById(id as ComponentId)!;
        moduleComponents.push(comp.toSchema());
      });
    }

    // 添加module handler
    const moduleHandlers = methodRelations.map(r => {
      const { handler } = r;
      return {
        ...handler,
        type: `${r.source}${r.event}`,
      };
    });

    // 开始处理 State
    const stateMap: Record<string, string> = {};
    outsideExpRelations.forEach(r => {
      // 添加 StateMap
      if (r.stateName) {
        const origin = `${r.relyOn}.${r.valuePath}`;
        stateMap[r.stateName] = origin;
        // 然后一个个替换Exp里的字符串
        const newExp = r.exp.replaceAll(origin, `${newModuleId}.${r.stateName}`);
        const c = this.appModelManager.appModel.getComponentById(
          r.componentId as ComponentId
        )!;
        const fieldKey = r.key.startsWith('.') ? r.key.slice(1) : r.key;
        const newProperties = set(c.properties.rawValue, fieldKey, newExp);
        console.log('newProperties', newProperties);
        this.eventBus.send(
          'operation',
          genOperation(this.registry, 'modifyComponentProperties', {
            componentId: r.componentId,
            properties: newProperties,
          })
        );
      }
    });

    console.log('propertySpec', propertySpec);
    console.log('moduleComponents', moduleComponents);
    const rawModule = this.appStorage.createModule(
      moduleComponents,
      propertySpec,
      eventSpec,
      moduleVersion,
      moduleName,
      stateMap
    );

    const module = createModule(rawModule);
    this.registry.registerModule(module);

    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'createComponent', {
        componentId: newModuleContainerId,
        componentType: `core/v1/moduleContainer`,
      })
    );
    this.eventBus.send(
      'operation',
      genOperation(this.registry, 'modifyComponentProperties', {
        componentId: newModuleContainerId,
        properties: {
          id: newModuleId,
          type: `${moduleVersion}/${moduleName}`,
          properties,
          handlers: moduleHandlers,
        },
      })
    );
    console.log('properties', properties);
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

  setValidateResult = (validateResult: ValidateErrorResult[]) => {
    this.validateResult = validateResult;
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
