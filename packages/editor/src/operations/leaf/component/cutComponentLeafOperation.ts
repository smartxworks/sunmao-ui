import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { tryOriginal } from 'operations/util';
import { BaseLeafOperation } from '../../type';

export type CutComponentLeafOperationContext = {
  componentId: string;
};

export class CutComponentLeafOperation extends BaseLeafOperation<CutComponentLeafOperationContext> {
  private deletedComponent!: ApplicationComponent;
  // FIXME: index is not a good type to remember a deleted resource
  private deletedIndex = -1;

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    this.deletedIndex = prev.findIndex(
      c => c.id === this.context.componentId
    );
    if (this.deletedIndex === -1) {
      console.warn('element not found');
      return prev;
    }
    return produce(prev, draft => {
      this.deletedComponent = tryOriginal(
        draft.splice(this.deletedIndex, 1)[0]
      );
    });
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      draft.splice(this.deletedIndex, 1);
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      draft.splice(this.deletedIndex, 0, this.deletedComponent);
    });
  }
}
