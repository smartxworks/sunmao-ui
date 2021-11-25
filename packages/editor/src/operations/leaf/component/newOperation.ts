import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
import { genComponent } from '../../util';

export type NewComponentOperationContext = {
  componentType: string;
  componentId: string;
};

export class NewComponentOperation extends BaseLeafOperation<NewComponentOperationContext> {
  do(prev: Application): Application {
    const newComponent = genComponent(
      this.context.componentType,
      this.context.componentId
    );
    this.context.componentId = newComponent.id;
    return produce(prev, draft => {
      draft.spec.components.push(newComponent);
    });
  }
  
  undo(prev: Application): Application {
    return produce(prev, draft => {
      const remains = draft.spec.components.filter(
        c => c.id !== this.context.componentId
      );
      if (remains.length === draft.spec.components.length) {
        console.warn('element not found');
      }
      draft.spec.components = remains;
    });
  }
}
