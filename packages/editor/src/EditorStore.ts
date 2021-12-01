import { makeAutoObservable, autorun, observable, action } from 'mobx';
import { ApplicationComponent } from '@sunmao-ui/core';
import { eventBus } from './eventBus';
import { AppStorage } from './AppStorage';
import { registry } from './setup';

type EditingTarget = {
  kind: 'app' | 'module';
  version: string;
  name: string;
};

class EditorStore {
  components: ApplicationComponent[] = [];
  // currentEditingComponents, it could be app's or module's components
  selectedComponentId = '';
  hoverComponentId = '';
  // current editor editing target(app or module)
  currentEditingTarget: EditingTarget = {
    kind: 'app',
    version: '',
    name: '',
  };

  appStorage = new AppStorage();

  get app() {
    return this.appStorage.app;
  }

  get modules() {
    return this.appStorage.modules;
  }

  get selectedComponent() {
    return this.components.find(c => c.id === this.selectedComponentId);
  }

  constructor() {
    makeAutoObservable(this, {
      components: observable.shallow,
      setComponents: action,
    });

    this.updateCurrentEditingTarget('app', this.app.version, this.app.metadata.name);

    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    // listen the change by operations, and save newComponents
    eventBus.on('componentsChange', components => {
      this.setComponents(components);
      this.appStorage.saveComponentsInLS(
        this.currentEditingTarget.kind,
        this.currentEditingTarget.version,
        this.currentEditingTarget.name,
        components
      );
      if (this.currentEditingTarget.kind === 'module') {
        // reregister modules to activate immediately
        this.modules.forEach(m => registry.registerModule(m, true));
      }
    });

    autorun(() => {
      eventBus.send('componentsRefresh', this.originComponents);
      this.setComponents(this.originComponents);
    });
  }

  // origin components of app of module
  // when switch app or module, components should refresh
  get originComponents(): ApplicationComponent[] {
    switch (this.currentEditingTarget.kind) {
      case 'module':
        const module = this.modules.find(
          m =>
            m.version === this.currentEditingTarget.version &&
            m.metadata.name === this.currentEditingTarget.name
        );
        return module?.components || [];
      case 'app':
        return this.app.spec.components;
    }
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
    this.selectedComponentId = val;
  };
  setHoverComponentId = (val: string) => {
    this.hoverComponentId = val;
  };
  setComponents = (val: ApplicationComponent[]) => {
    this.components = val;
  };
}

export const editorStore = new EditorStore();
