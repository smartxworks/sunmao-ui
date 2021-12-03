import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import produce from 'immer';
import { tryOriginal } from 'operations/util';
import { BaseLeafOperation } from '../../type';

export type RemoveTraitLeafOperationContext = {
  componentId: string;
  index: number;
};

export class RemoveTraitLeafOperation extends BaseLeafOperation<RemoveTraitLeafOperationContext> {
  private deletedTrait!: ComponentTrait;
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const componentIndex = prev.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (!draft[componentIndex].traits[this.context.index]) {
        console.warn('trait not foudn');
        return;
      }
      this.deletedTrait = tryOriginal(
        draft[componentIndex].traits.splice(this.context.index, 1)[0]
      );
    });
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const componentIndex = prev.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (!draft[componentIndex].traits[this.context.index]) {
        console.warn('trait not foudn');
        return;
      }
      draft[componentIndex].traits.splice(this.context.index, 1);
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    const componentIndex = prev.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (draft[componentIndex].traits.length < this.context.index) {
        console.warn('corrupted index');
      }
      draft[componentIndex].traits.splice(
        this.context.index,
        0,
        this.deletedTrait
      );
    });
  }
}
