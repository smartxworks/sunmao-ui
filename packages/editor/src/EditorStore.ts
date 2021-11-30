import { makeAutoObservable } from 'mobx';
import { eventBus } from './eventBus';

class EditorStore {
  selectedComponentId = '';

  constructor() {
    eventBus.on('selectComponent', id => {
      this.setSelectedComponentId(id);
    });
    makeAutoObservable(this);
  }

  setSelectedComponentId(val: string) {
    this.selectedComponentId = val;
  }
}

export const editorStore = new EditorStore()
