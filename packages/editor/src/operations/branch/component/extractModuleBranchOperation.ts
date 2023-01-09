import { AppModel } from '../../../AppModel/AppModel';
import {
  CreateComponentLeafOperation,
  ModifyComponentPropertiesLeafOperation,
  ModifyTraitPropertiesLeafOperation,
} from '../../leaf';
import { BaseBranchOperation } from '../../type';
import { EventHandlerSpec } from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { MoveComponentBranchOperation, RemoveComponentBranchOperation } from '..';
import { ComponentId, SlotName } from '../../../AppModel/IAppModel';

type TraitNewProperties = {
  componentId: string;
  traitIndex: number;
  properties: Record<string, any>;
};
export type ExtractModuleBranchOperationContext = {
  moduleContainerId: string;
  moduleContainerProperties: Record<string, any>;
  moduleId: string;
  moduleRootId: string;
  moduleType: string;
  moduleHandlers: Static<typeof EventHandlerSpec>[];
  outsideComponentNewProperties: Record<string, any>;
  outsideTraitNewProperties: TraitNewProperties[];
  toDeleteComponentIds: string[];
};

export class ExtractModuleBranchOperation extends BaseBranchOperation<ExtractModuleBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const root = prev.getComponentById(this.context.moduleRootId as ComponentId);
    if (!root) {
      console.warn('component not found');
      return prev;
    }
    // create module container component
    this.operationStack.insert(
      new CreateComponentLeafOperation(this.registry, {
        componentId: this.context.moduleContainerId,
        componentType: `core/v1/moduleContainer`,
      })
    );

    // add properties to module container component
    this.operationStack.insert(
      new ModifyComponentPropertiesLeafOperation(this.registry, {
        componentId: this.context.moduleContainerId,
        properties: {
          id: this.context.moduleId,
          type: this.context.moduleType,
          properties: this.context.moduleContainerProperties,
          handlers: this.context.moduleHandlers,
        },
      })
    );

    // move module container to the position of root
    this.operationStack.insert(
      new MoveComponentBranchOperation(this.registry, {
        fromId: this.context.moduleContainerId,
        toId: root.parentId as ComponentId,
        slot: root.parentSlot as SlotName,
        targetId: root.id,
        direction: 'next',
      })
    );

    // update the properties of outside components
    for (const id in this.context.outsideComponentNewProperties) {
      this.operationStack.insert(
        new ModifyComponentPropertiesLeafOperation(this.registry, {
          componentId: id,
          properties: this.context.outsideComponentNewProperties[id],
        })
      );
    }
    // update the properties of outside components' trait
    this.context.outsideTraitNewProperties.forEach(
      ({ componentId, traitIndex, properties }) => {
        this.operationStack.insert(
          new ModifyTraitPropertiesLeafOperation(this.registry, {
            componentId,
            traitIndex,
            properties,
          })
        );
      }
    );

    // remove the module root component
    this.operationStack.insert(
      new RemoveComponentBranchOperation(this.registry, {
        componentId: this.context.moduleRootId,
      })
    );

    // remove other components which are moved in to module
    this.context.toDeleteComponentIds.forEach(id => {
      this.operationStack.insert(
        new RemoveComponentBranchOperation(this.registry, {
          componentId: id,
        })
      );
    });

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
