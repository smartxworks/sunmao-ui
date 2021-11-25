import { Application, ComponentTrait } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';

export type FreeTraitOperationContext = {
  componentId: string;
  index: number;
};

export class FreeTraitOperation extends BaseLeafOperation<FreeTraitOperationContext> {
  private deletedTrait!: ComponentTrait;
  do(prev: Application): Application {
    const componentIndex = prev.spec.components.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (!draft.spec.components[componentIndex].traits[this.context.index]) {
        console.warn('trait not foudn');
        return;
      }
      this.deletedTrait = draft.spec.components[componentIndex].traits.splice(
        this.context.index,
        1
      )[0];
    });
  }

  redo(prev: Application): Application {
    const componentIndex = prev.spec.components.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (!draft.spec.components[componentIndex].traits[this.context.index]) {
        console.warn('trait not foudn');
        return;
      }
      draft.spec.components[componentIndex].traits.splice(this.context.index, 1);
    });
  }

  undo(prev: Application): Application {
    const componentIndex = prev.spec.components.findIndex(
      c => c.id === this.context.componentId
    );
    if (componentIndex === -1) {
      console.warn('component was removed');
      return prev;
    }
    return produce(prev, draft => {
      if (draft.spec.components[componentIndex].traits.length < this.context.index) {
        console.warn('corrupted index');
      }
      draft.spec.components[componentIndex].traits.splice(
        this.context.index,
        0,
        this.deletedTrait
      );
    });
  }
}
