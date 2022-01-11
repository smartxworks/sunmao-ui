import { ComponentSchema } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../type';

export type ReplaceAppLeafOperationContext = {
  app: ComponentSchema[];
};

export class ReplaceAppLeafOperation extends BaseLeafOperation<ReplaceAppLeafOperationContext> {
  private previousState!: ComponentSchema[];
  do(prev: ComponentSchema[]): ComponentSchema[] {
    this.previousState = prev;
    return produce(prev, () => {
      return this.context.app;
    });
  }

  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return produce(prev, () => {
      return this.context.app;
    });
  }

  undo(prev: ComponentSchema[]): ComponentSchema[] {
    return produce(prev, () => {
      return this.previousState;
    });
  }
}
