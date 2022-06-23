import { AppModel } from '../../../AppModel/AppModel';
import { RemoveComponentLeafOperation } from '../../leaf';
import { BaseBranchOperation } from '../../type';

export type RemoveComponentBranchOperationContext = {
  componentId: string;
};

export class RemoveComponentBranchOperation extends BaseBranchOperation<RemoveComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    // free component from schema
    this.operationStack.insert(
      new RemoveComponentLeafOperation(this.registry, {
        componentId: this.context.componentId,
      })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
