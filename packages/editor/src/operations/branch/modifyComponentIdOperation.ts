import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { ModifyComponentPropertiesOperation } from '../leaf/component/modifyPropertiesOperation';
import { ModifyComponentIdOperation as LeafModifyComponentIdOperation } from '../leaf/component/modifyIdOperation';
import { ModifyTraitPropertiesOperation } from '../leaf/trait/modifyPropertiesOperation';
import { BaseBranchOperation } from '../type';
import { UpdateSelectIdOperation } from '../leaf/updateSelectIdOperation';
import { ApplicationInstance } from '../../setup';

export type ModifyComponentIdOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdOperation extends BaseBranchOperation<ModifyComponentIdOperationContext> {
  do(prev: Application): Application {
    const toReId = prev.spec.components.find(c => c.id === this.context.componentId);
    if (!toReId) {
      console.warn('component not found');
      return prev;
    }

    const parentId = (
      toReId.traits.find(t => t.type === 'core/v1/slot')?.properties as
        | { id: string }
        | undefined
    )?.id;

    prev.spec.components.forEach(component => {
      if (component.id === parentId && component.type === 'core/v1/grid_layout') {
        this.operationStack.insert(
          new ModifyComponentPropertiesOperation({
            componentId: component.id,
            properties: {
              layout: (prev: Array<ReactGridLayout.Layout>) => {
                return produce(prev, draft => {
                  for (const layout of draft) {
                    if (layout.i === this.context.componentId) {
                      layout.i = this.context.newId;
                      break;
                    }
                  }
                });
              },
            },
          })
        );
      }
      const slotTraitIndex = component.traits.findIndex(
        trait => trait.type === 'core/v1/slot'
      );
      if (
        slotTraitIndex !== -1 &&
        (component.traits[slotTraitIndex].properties.container as { id: string }).id ===
          this.context.componentId
      ) {
        // for direct children of the element, update their slot trait to new id
        this.operationStack.insert(
          new ModifyTraitPropertiesOperation({
            componentId: component.id,
            traitIndex: slotTraitIndex,
            properties: {
              container: (prev: { id: string }) => {
                prev.id = this.context.newId;
                return prev;
              },
            },
          })
        );
      }
    });

    // update component id to new id
    this.operationStack.insert(new LeafModifyComponentIdOperation(this.context));
    // update selectid
    this.operationStack.insert(
      new UpdateSelectIdOperation({
        componentId: ApplicationInstance.selectedComponent?.id,
        newId: this.context.newId,
      })
    );

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
