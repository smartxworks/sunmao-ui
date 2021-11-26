import { Application, ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type RemoveComponentLeafOperationContext = {
  componentId: string;
};

export class RemoveComponentLeafOperation extends BaseLeafOperation<RemoveComponentLeafOperationContext> {
  private deletedComponent!: ApplicationComponent;
  // FIXME: index is not a good type to remember a deleted resource
  private deletedIndex = -1;

  do(prev: Application): Application {
    this.deletedIndex = prev.spec.components.findIndex(
      c => c.id === this.context.componentId
    );
    if (this.deletedIndex === -1) {
      console.warn('element not found');
      return prev;
    }
    return produce(prev, draft => {
      this.deletedComponent = draft.spec.components.splice(this.deletedIndex, 1)[0];
    });
  }

  redo(prev: Application): Application {
    return produce(prev, draft => {
      draft.spec.components.splice(this.deletedIndex, 1);
    });
  }

  undo(prev: Application): Application {
    return produce(prev, draft => {
      draft.spec.components.splice(this.deletedIndex, 0, this.deletedComponent);
    });
  }
}
