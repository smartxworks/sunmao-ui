import { ComponentSchema } from '@sunmao-ui/core';
import { BaseBranchOperation } from '../type';
import {
  ModifyComponentIdLeafOperation,
  UpdateSelectComponentLeafOperation,
} from '../leaf';

export type ModifyComponentIdBranchOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdBranchOperation extends BaseBranchOperation<ModifyComponentIdBranchOperationContext> {
  do(prev: ComponentSchema[]): ComponentSchema[] {
    this.operationStack.insert(new ModifyComponentIdLeafOperation(this.registry, this.context));

    // update selectid
    this.operationStack.insert(
      new UpdateSelectComponentLeafOperation(this.registry, {
        // TODO:  need a way to get selectedComponent.id here
        // componentId: ApplicationComponent[]Instance.selectedComponent?.id,
        componentId: '',
        newId: this.context.newId,
      })
    );

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
