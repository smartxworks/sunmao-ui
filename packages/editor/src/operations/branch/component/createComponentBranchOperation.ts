import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, ComponentType, SlotName } from '../../../AppModel/IAppModel';
import {
  AdjustComponentOrderLeafOperation,
  CreateComponentLeafOperation,
} from '../../leaf';
import { BaseBranchOperation } from '../../type';

export type CreateComponentBranchOperationContext = {
  componentType: string;
  componentId?: string;
  slot?: string;
  parentId?: string;
  targetId?: string;
  direction?: 'prev' | 'next';
};

export class CreateComponentBranchOperation extends BaseBranchOperation<CreateComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    // gen component id
    if (!this.context.componentId) {
      this.context.componentId = prev.genId(this.context.componentType as ComponentType);
    }
    // insert a new component to schema
    this.operationStack.insert(
      new CreateComponentLeafOperation(this.registry, {
        componentId: this.context.componentId!,
        componentType: this.context.componentType,
        parentId: this.context.parentId as ComponentId,
        slot: this.context.slot as SlotName,
      })
    );
    // add a slot trait if it has a parent
    if (this.context.parentId && this.context.slot) {
      // try to find parent
      const parentComponent = prev.getComponentById(this.context.parentId as ComponentId);

      if (!parentComponent) {
        console.warn("insert element has an invalid parent, it won't show in the view");
      }
    }

    if (this.context.direction) {
      this.operationStack.insert(
        new AdjustComponentOrderLeafOperation(this.registry, {
          componentId: this.context.componentId as ComponentId,
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
