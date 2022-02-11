import { AppModel } from '../../../AppModel/AppModel';
import { BaseBranchOperation } from '../../type';
import {
  CreateTraitLeafOperation,
  ModifyTraitPropertiesLeafOperation,
  RemoveTraitLeafOperation,
} from '../../leaf';
import { ComponentId } from '../../../AppModel/IAppModel';

export type MoveComponentBranchOperationContext = {
  fromId: string;
  toId: string;
  slot: string;
};

export class MoveComponentBranchOperation extends BaseBranchOperation<MoveComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const from = prev.getComponentById(this.context.fromId as ComponentId);
    if (!from) return prev;

    const traitIndex = from.traits.findIndex(t => t.type === 'core/v1/slot');

    if (this.context.toId === '__root__') {
      this.operationStack.insert(
        new RemoveTraitLeafOperation(this.registry, {
          componentId: this.context.fromId,
          index: traitIndex,
        })
      );
    } else {
      const newSlotProperties = {
        container: { id: this.context.toId, slot: this.context.slot },
      };
      if (traitIndex > -1) {
        this.operationStack.insert(
          new ModifyTraitPropertiesLeafOperation(this.registry, {
            componentId: this.context.fromId,
            traitIndex,
            properties: newSlotProperties,
          })
        );
      } else {
        this.operationStack.insert(
          new CreateTraitLeafOperation(this.registry, {
            componentId: this.context.fromId,
            traitType: 'core/v1/slot',
            properties: newSlotProperties,
          })
        );
      }
    }

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
