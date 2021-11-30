import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
import _ from 'lodash-es';
import { tryOriginal } from '../../util';
export type ModifyComponentPropertiesLeafOperationContext = {
  componentId: string;
  properties: Record<string, any | (<T = any>(prev: T) => T)>;
};

export class ModifyComponentPropertiesLeafOperation extends BaseLeafOperation<ModifyComponentPropertiesLeafOperationContext> {
  private previousState: Record<string, any> = {};
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      for (const property in this.context.properties) {
        // assign previous data
        this.previousState[property] = tryOriginal(comp.properties[property]);
        if (_.isFunction(this.context.properties[property])) {
          // if modified value is a lazy function, execute it and assign
          this.context.properties[property] = this.context.properties[property](
            _.cloneDeep(comp.properties[property])
          );
        }
        comp.properties[property] = this.context.properties[property];
      }
    });
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      for (const property in this.context.properties) {
        comp.properties[property] = this.context.properties[property];
      }
    });
  }
  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      for (const property in this.context.properties) {
        comp.properties[property] = this.previousState[property];
      }
    });
  }
}
