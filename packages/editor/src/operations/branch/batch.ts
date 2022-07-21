import { AppModel } from '../../AppModel/AppModel';
import { BaseBranchOperation } from '../type';
import { OperationConstructors } from '../index';

type Operation = {
  type: keyof typeof OperationConstructors;
  props: any;
};

export type BatchBranchOperationContext = {
  operations: Operation[];
};

export class BatchBranchOperation extends BaseBranchOperation<BatchBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const { operations } = this.context;

    operations.forEach(operation => {
      this.operationStack.insert(
        new OperationConstructors[operation.type](this.registry, operation.props)
      );
    });

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
