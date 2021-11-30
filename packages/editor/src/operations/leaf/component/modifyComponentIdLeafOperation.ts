import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type ModifyComponentIdLeafOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdLeafOperation extends BaseLeafOperation<ModifyComponentIdLeafOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      comp.id = this.context.newId;
    });
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      comp.id = this.context.newId;
    });
  }
  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.newId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      comp.id = this.context.componentId;
    });
  }
}
