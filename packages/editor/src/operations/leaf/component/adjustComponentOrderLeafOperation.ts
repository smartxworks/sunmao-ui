import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderLeafOperationContext = {
  orientation: 'up' | 'down';
  componentId: string;
};

export class AdjustComponentOrderLeafOperation extends BaseLeafOperation<AdjustComponentOrderLeafOperationContext> {
  private dest = -1;
  private index = -1;
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      this.index = draft.findIndex(
        c => c.id === this.context.componentId
      );
      if (this.index === -1) {
        console.warn('component not found');
        return;
      }

      const movedElement = draft[this.index];
      const slotTrait = movedElement.traits.find(t => t.type === 'core/v1/slot');
      if (!slotTrait) {
        // for top level element, find the next top level element;
        switch (this.context.orientation) {
          case 'up':
            for (this.dest = this.index - 1; this.dest >= 0; this.dest--) {
              const nextComponent = draft[this.dest];
              if (!nextComponent.traits.some(t => t.type === 'core/v1/slot')) {
                break;
              }
            }
            // if found -1, means no any top level element is in the previous postion for target element
            break;
          case 'down':
            for (
              this.dest = this.index + 1;
              this.dest < draft.length;
              this.dest++
            ) {
              const nextComponent = draft[this.dest];
              if (!nextComponent.traits.some(t => t.type === 'core/v1/slot')) {
                break;
              }
            }
            if (this.dest === draft.length) {
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
              const nextComponent = draft[this.dest];
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
              this.dest < draft.length;
              this.dest++
            ) {
              const nextComponent = draft[this.dest];
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
            if (this.dest === draft.length) {
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
      if (movedElement) {
        switch (this.context.orientation) {
          case 'up': {
            const movedElement = draft.splice(this.index, 1)[0];
            draft.splice(this.dest - 1, 0, movedElement);
            break;
          }
          case 'down': {
            const movedElement = draft.splice(this.index, 1)[0];
            draft.splice(this.dest + 1, 0, movedElement);
            break;
          }
        }
      }
    });
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      switch (this.context.orientation) {
        case 'up': {
          const movedElement = draft.splice(this.index, 1)[0];
          draft.splice(this.dest - 1, 0, movedElement);
          break;
        }
        case 'down': {
          const movedElement = draft.splice(this.index, 1)[0];
          draft.splice(this.dest + 1, 0, movedElement);
          break;
        }
      }
    });
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      switch (this.context.orientation) {
        case 'up': {
          const movedElement = draft.splice(this.dest - 1, 1)[0];
          draft.splice(this.index, 0, movedElement);
          break;
        }
        case 'down': {
          const movedElement = draft.splice(this.dest + 1, 1)[0];
          draft.splice(this.index, 0, movedElement);
          break;
        }
      }
    });
  }
}
