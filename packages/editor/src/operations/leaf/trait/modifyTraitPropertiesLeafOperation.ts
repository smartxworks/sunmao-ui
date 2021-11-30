import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import _ from 'lodash-es';
import { tryOriginal } from '../../util';
import { BaseLeafOperation } from '../../type';

export type ModifyTraitPropertiesLeafOperationContext = {
  componentId: string;
  traitIndex: number;
  properties: Record<string, any | (<T = any>(prev: T) => T)>;
};

export class ModifyTraitPropertiesLeafOperation extends BaseLeafOperation<ModifyTraitPropertiesLeafOperationContext> {
  private previousState: Record<string, any> = {};
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const comp = draft.find(c => c.id === this.context.componentId);
      if (!comp) {
        console.warn('component not found');
        return;
      }
      const targetTrait = comp.traits[this.context.traitIndex];
      if (!targetTrait) {
        console.warn('trait not found');
        return;
      }
      for (const property in this.context.properties) {
        // assign previous data
        this.previousState[property] = tryOriginal(targetTrait.properties[property]);
        if (_.isFunction(this.context.properties[property])) {
          // execute lazy load value
          this.context.properties[property] = this.context.properties[property](
            _.cloneDeep(this.previousState[property])
          );
        }
        comp.traits[this.context.traitIndex].properties[property] =
          this.context.properties[property];
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
      const targetTrait = comp.traits[this.context.traitIndex];
      if (!targetTrait) {
        console.warn('trait not found');
        return;
      }
      for (const property in this.context.properties) {
        comp.traits[this.context.traitIndex].properties[property] =
          this.context.properties[property];
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
      const targetTrait = comp.traits[this.context.traitIndex];
      if (!targetTrait) {
        console.warn('trait not found');
        return;
      }
      for (const property in this.context.properties) {
        targetTrait.properties[property] = this.previousState[property];
      }
    });
  }
}
