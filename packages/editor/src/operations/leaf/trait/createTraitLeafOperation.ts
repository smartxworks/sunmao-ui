import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type CreateTraitLeafOperationContext = {
  componentId: string;
  traitType: string;
  properties: Record<string, any>;
};

export class CreateTraitLeafOperation extends BaseLeafOperation<CreateTraitLeafOperationContext> {
  private traitIndex!: number;

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      for (const component of draft) {
        if (component.id === this.context.componentId) {
          component.traits.push({
            type: this.context.traitType,
            properties: this.context.properties,
          });
          this.traitIndex = component.traits.length - 1;
          break;
        }
      }
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      for (let i = 0; i < draft.length; i++) {
        const component = draft[i];
        if (component.id === this.context.componentId) {
          component.traits.splice(this.traitIndex, 1);
          return;
        } else if (i === draft.length - 1) {
          console.warn('trait not found');
          return;
        }
      }
      console.warn('component not found');
    });
  }
}
