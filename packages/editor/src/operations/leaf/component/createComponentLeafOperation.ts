import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
import { genComponent } from '../../util';

export type CreateComponentLeafOperationContext = {
  componentType: string;
  componentId: string;
};

export class CreateComponentLeafOperation extends BaseLeafOperation<CreateComponentLeafOperationContext> {
  private index!: number;
  private component!: ApplicationComponent;
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    this.component = genComponent(this.context.componentType, this.context.componentId);
    this.context.componentId = this.component.id;
    return produce(prev, draft => {
      draft.push(this.component);
      this.index = draft.length - 1;
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
