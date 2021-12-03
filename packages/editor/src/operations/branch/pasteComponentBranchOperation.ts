import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { PasteComponentLeafOperation } from '../leaf/component/pasteComponentLeafOperation';
import { BaseBranchOperation } from '../type';

export type PasteComponentBranchOperationContext = {
  parentId: string;
  slot: string;
  components: ApplicationComponent[];
};

export class PasteComponentBranchOperation extends BaseBranchOperation<PasteComponentBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const newComponents = produce(this.context.components, draft => {
      const newSlotTrait = {
        type: 'core/v1/slot',
        properties: { container: { id: this.context.parentId, slot: this.context.slot } },
      };
      const oldSlotIndex = draft[0].traits.findIndex(
        trait => trait.type === 'core/v1/slot'
      );
      if (oldSlotIndex !== -1) {
        draft[0].traits.push(newSlotTrait);
      } else {
        draft[0].traits[oldSlotIndex] = newSlotTrait;
      }
    });
    console.log('paste', newComponents)
    newComponents.forEach(c => {
      this.operationStack.insert(
        new PasteComponentLeafOperation({
          component: c,
        })
      );
    });

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
