import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type NewTraitOperationContext = {
  componentId: string;
  traitType: string;
  properties: Record<string, any>;
};

export class NewTraitOperation extends BaseLeafOperation<NewTraitOperationContext> {
  private traitIndex!: number;

  do(prev: Application): Application {
    return produce(prev, draft => {
      for (const component of draft.spec.components) {
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

  undo(prev: Application): Application {
    return produce(prev, draft => {
      for (let i = 0; i < draft.spec.components.length; i++) {
        const component = draft.spec.components[i];
        if (component.id === this.context.componentId) {
          component.traits.splice(this.traitIndex, 1);
          return;
        } else if (i === draft.spec.components.length - 1) {
          console.warn('trait not found');
          return;
        }
      }
      console.warn('component not found');
    });
  }
}
