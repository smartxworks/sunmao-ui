import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderOperationContext = {
  orientation: 'up' | 'down';
  componentId: string;
};

export class AdjustComponentOrderOperation extends BaseLeafOperation<AdjustComponentOrderOperationContext> {
  do(prev: Application): Application {
    return produce(prev, draft => {
      const index = draft.spec.components.findIndex(
        c => c.id === this.context.componentId
      );
      if (index === -1) {
        console.warn('component not found');
        return;
      }
      const movedElement = draft.spec.components.splice(index, 1);
      switch (this.context.orientation) {
        case 'up':
          draft.spec.components.splice(index - 1, 0, movedElement[0]);
          break;
        case 'down':
          draft.spec.components.splice(index + 1, 0, movedElement[0]);
          break;
      }
    });
  }
  undo(prev: Application): Application {
    return produce(prev, draft => {
      const index = draft.spec.components.findIndex(
        c => c.id === this.context.componentId
      );
      if (index === -1) {
        console.warn('component not found');
        return;
      }
      const movedElement = draft.spec.components.splice(index, 1);
      switch (this.context.orientation) {
        case 'up':
          draft.spec.components.splice(index + 1, 0, movedElement[0]);
          break;
        case 'down':
          draft.spec.components.splice(index - 1, 0, movedElement[0]);
          break;
      }
    });
  }
}
