import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderLeafOperationContext = {
  orientation: 'up' | 'down';
  componentId: string;
};

export class AdjustComponentOrderLeafOperation extends BaseLeafOperation<AdjustComponentOrderLeafOperationContext> {
  private dest = -1;
  private index = -1;
  do(prev: Application): Application {
    return produce(prev, draft => {
      this.index = draft.spec.components.findIndex(
        c => c.id === this.context.componentId
      );
      if (this.index === -1) {
        console.warn('component not found');
        return;
      }

      const movedElement = draft.spec.components[this.index];
      const slotTrait = movedElement.traits.find(t => t.type === 'core/v1/slot');
      if (!slotTrait) {
        // for top level element, find the next top level element;
        switch (this.context.orientation) {
          case 'up':
            for (this.dest = this.index - 1; this.dest >= 0; this.dest--) {
              const nextComponent = draft.spec.components[this.dest];
              if (
                nextComponent.type !== 'core/v1/dummy' &&
                !nextComponent.traits.some(t => t.type === 'core/v1/slot')
              ) {
                break;
              }
            }
            // if found -1, means no any top level element is in the previous postion for target element
            break;
          case 'down':
            for (
              this.dest = this.index + 1;
              this.dest < draft.spec.components.length;
              this.dest++
            ) {
              const nextComponent = draft.spec.components[this.dest];
              if (!nextComponent.traits.some(t => t.type === 'core/v1/slot')) {
                break;
              }
            }
            if (this.dest === draft.spec.components.length) {
              // mark dest as -1 due to not found element
              this.dest = -1;
            }
            break;
        }
      } else {
        // for child element, search the element share the same parent with target element
        switch (this.context.orientation) {
          case 'up':
            for (this.dest = this.index - 1; this.dest >= 0; this.dest--) {
              const nextComponent = draft.spec.components[this.dest];
              if (
                nextComponent.traits.some(
                  t =>
                    t.type === 'core/v1/slot' &&
                    (t.properties.container as { id: string }).id ===
                      (slotTrait.properties.container as { id: string }).id
                )
              ) {
                break;
              }
            }
            // if found -1, means no any top level element is in the previous postion for target element
            break;
          case 'down':
            for (
              this.dest = this.index + 1;
              this.dest < draft.spec.components.length;
              this.dest++
            ) {
              const nextComponent = draft.spec.components[this.dest];
              if (
                nextComponent.traits.some(
                  t =>
                    t.type === 'core/v1/slot' &&
                    (t.properties.container as { id: string }).id ===
                      (slotTrait.properties.container as { id: string }).id
                )
              ) {
                break;
              }
            }
            if (this.dest === draft.spec.components.length) {
              // mark dest as -1 due to not found element
              this.dest = -1;
            }
            break;
        }
      }
      if (this.dest === -1) {
        console.warn(`the element cannot move ${this.context.orientation}`);
        return;
      }
      const [highPos, lowPos] = [this.dest, this.index].sort();
      const lowComponent = draft.spec.components.splice(lowPos, 1)[0];
      const highComponent = draft.spec.components.splice(highPos, 1)[0];
      draft.spec.components.splice(lowPos - 1, 0, highComponent);
      draft.spec.components.splice(highPos, 0, lowComponent);
    });
  }
  redo(prev: Application): Application {
    return produce(prev, draft => {
      if (this.index === -1) {
        console.warn("operation hasn't been executed, cannot redo");
      }
      if (this.dest === -1) {
        console.warn('cannot redo, the operation was failed executing');
        return;
      }
      const lowPos = Math.max(this.dest, this.index);
      const highPos = Math.min(this.dest, this.index);
      const lowComponent = draft.spec.components.splice(lowPos, 1)[0];
      const highComponent = draft.spec.components.splice(highPos, 1)[0];
      draft.spec.components.splice(lowPos - 1, 0, highComponent);
      draft.spec.components.splice(highPos, 0, lowComponent);
    });
  }

  undo(prev: Application): Application {
    return produce(prev, draft => {
      if (this.index === -1) {
        console.warn("cannot undo operation, the operation hasn't been executed.");
      }
      if (this.dest === -1) {
        console.warn('cannot undo, the operation was failed executing');
        return;
      }
      const lowPos = Math.max(this.dest, this.index);
      const highPos = Math.min(this.dest, this.index);
      const lowComponent = draft.spec.components.splice(lowPos, 1)[0];
      const highComponent = draft.spec.components.splice(highPos, 1)[0];
      draft.spec.components.splice(lowPos - 1, 0, highComponent);
      draft.spec.components.splice(highPos, 0, lowComponent);
    });
  }
}
