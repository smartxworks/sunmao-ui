import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
import { genComponent } from '../../util';

export type CreateComponentLeafOperationContext = {
  componentType: string;
  componentId: string;
};

export class CreateComponentLeafOperation extends BaseLeafOperation<CreateComponentLeafOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const newComponent = genComponent(
      this.context.componentType,
      this.context.componentId
    );
    this.context.componentId = newComponent.id;
    return produce(prev, draft => {
      draft.push(newComponent);
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      const remains = draft.filter(
        c => c.id !== this.context.componentId
      );
      if (remains.length === draft.length) {
        console.warn('element not found');
      }
      draft = remains;
    });
  }
}
