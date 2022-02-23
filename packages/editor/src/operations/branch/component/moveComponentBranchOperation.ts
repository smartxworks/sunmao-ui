import { AppModel } from '../../../AppModel/AppModel';
import { BaseBranchOperation } from '../../type';
import {
  AdjustComponentOrderLeafOperation,
  MoveComponentLeafOperation,
} from '../../leaf';
import { ComponentId } from '../../../AppModel/IAppModel';

export type MoveComponentBranchOperationContext = {
  fromId: string;
  toId?: string;
  slot?: string;
  targetId?: string;
  direction?: 'prev' | 'next';
};

export class MoveComponentBranchOperation extends BaseBranchOperation<MoveComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const from = prev.getComponentById(this.context.fromId as ComponentId);
    if (!from) return prev;

    if (from.parentId !== this.context.toId || from.parentSlot !== this.context.slot) {
      this.operationStack.insert(
        new MoveComponentLeafOperation(this.registry, {
          componentId: this.context.fromId,
          parent: this.context.toId,
          slot: this.context.slot,
        })
      );
    }

    if (this.context.direction) {
      this.operationStack.insert(
        new AdjustComponentOrderLeafOperation(this.registry, {
          componentId: this.context.fromId as ComponentId,
          targetId: this.context.targetId as ComponentId,
          direction: this.context.direction,
        })
      );
    }

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
