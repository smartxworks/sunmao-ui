import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { BaseBranchOperation } from '../type';
import {
  ModifyComponentIdLeafOperation,
  ModifyComponentPropertiesLeafOperation,
  ModifyTraitPropertiesLeafOperation,
  UpdateSelectComponentLeafOperation,
} from '../leaf';

export type ModifyComponentIdBranchOperationContext = {
  componentId: string;
  newId: string;
};

export class ModifyComponentIdBranchOperation extends BaseBranchOperation<ModifyComponentIdBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const toReId = prev.find(c => c.id === this.context.componentId);
    if (!toReId) {
      console.warn('component not found');
      return prev;
    }

    const parentId = (
      toReId.traits.find(t => t.type === 'core/v1/slot')?.properties as
        | { id: string }
        | undefined
    )?.id;

    prev.forEach(component => {
      if (component.id === parentId && component.type === 'core/v1/grid_layout') {
        this.operationStack.insert(
          new ModifyComponentPropertiesLeafOperation({
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
          new ModifyTraitPropertiesLeafOperation({
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
    this.operationStack.insert(new ModifyComponentIdLeafOperation(this.context));
    // update selectid
    this.operationStack.insert(
      new UpdateSelectComponentLeafOperation({
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
