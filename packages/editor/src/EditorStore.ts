import { makeAutoObservable } from 'mobx';
import { ApplicationComponent } from '../../core/lib';
import { eventBus } from './eventBus';

class EditorStore {
  selectedComponentId = '';
  components: ApplicationComponent[] = [];

  constructor() {
    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    eventBus.on('componentsChange', (components: ApplicationComponent[]) => {
      this.setComponents(components);
    });
    makeAutoObservable(this);
  }

  setSelectedComponentId(val: string) {
    this.selectedComponentId = val;
  }
  setComponents(val: ApplicationComponent[]) {
    this.components = val;
  }
}

export const editorStore = new EditorStore()
