import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import {
  ModifyComponentPropertiesLeafOperation,
  CutComponentLeafOperation,
} from '../leaf';
import { BaseBranchOperation } from '../type';

export type CutComponentBranchOperationContext = {
  componentId: string;
};

export class CutComponentBranchOperation extends BaseBranchOperation<CutComponentBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    // find component to remove
    const toRemove = prev.find(c => c.id === this.context.componentId);
    if (!toRemove) {
      console.warn('component not found');
      return prev;
    }
    // check if it has a slot trait (mean it is a child component of an slot-based component)
    let parentId = (
      toRemove.traits.find(t => t.type === 'core/v1/slot')?.properties as
        | { id: string }
        | undefined
    )?.id;
    prev.forEach(component => {
      if (component.id === parentId && component.type !== 'core/v1/grid_layout') {
        // only need to modified layout from grid_layout component
        parentId = undefined;
      }
      const slotTrait = component.traits.find(trait => trait.type === 'core/v1/slot');
      if (
        slotTrait &&
        (slotTrait.properties.container as { id: string }).id === this.context.componentId
      ) {
        // for direct children of the element, use Remove operation to delete them, it will cause a cascade deletion
        this.operationStack.insert(
          new CutComponentBranchOperation({ componentId: component.id })
        );
      }
    });

    if (parentId) {
      // modify layout property of parent grid layout component
      this.operationStack.insert(
        new ModifyComponentPropertiesLeafOperation({
          componentId: parentId,
          properties: {
            layout: (prev: Array<ReactGridLayout.Layout>) => {
              return produce(prev, draft => {
                const removeIndex = draft.findIndex(
                  item => item.i === this.context.componentId
                );
                if (removeIndex === -1) {
                  console.warn("parent element doesn' contain specific child");
                }
                draft.splice(removeIndex, 1);
              });
            },
          },
        })
      );
    }

    // free component from schema
    this.operationStack.insert(
      new CutComponentLeafOperation({ componentId: this.context.componentId })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
