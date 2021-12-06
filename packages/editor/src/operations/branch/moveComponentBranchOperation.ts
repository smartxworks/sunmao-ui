import { ApplicationComponent } from '@sunmao-ui/core';
import { BaseBranchOperation } from '../type';
import { CreateTraitLeafOperation, ModifyTraitPropertiesLeafOperation } from '../leaf';

export type MoveComponentBranchOperationContext = {
  fromId: string;
  toId: string;
  slot: string;
};

export class MoveComponentBranchOperation extends BaseBranchOperation<MoveComponentBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    console.log('onMoveComponent', this.context);
    const from = prev.find(c => c.id === this.context.fromId);
    if (!from) return prev;
    const traitIndex = from.traits.findIndex(t => t.type === 'core/v1/slot');

    const newSlotProperties = {
      container: { id: this.context.toId, slot: this.context.slot },
    };
    if (traitIndex > -1) {
      // update selectid
      this.operationStack.insert(
        new ModifyTraitPropertiesLeafOperation({
          componentId: this.context.fromId,
          traitIndex,
          properties: newSlotProperties,
        })
      );
    } else {
      this.operationStack.insert(
        new CreateTraitLeafOperation({
          componentId: this.context.fromId,
          traitType: 'core/v1/slot',
          properties: newSlotProperties,
        })
      );
    }

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
