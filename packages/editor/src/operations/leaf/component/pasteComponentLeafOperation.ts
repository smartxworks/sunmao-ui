import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type PasteComponentLeafOperationContext = {
  component: ApplicationComponent;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private index!: number;
  private component!: ApplicationComponent;  
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    this.component = this.context.component;
    this.index = prev.length;

    return produce(prev, draft => {
      draft.push(this.context.component);
    });
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      draft.push(this.component);
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      draft.splice(this.index, 1);
    });
  }
}
