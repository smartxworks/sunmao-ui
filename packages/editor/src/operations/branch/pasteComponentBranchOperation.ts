import { ApplicationComponent } from '@sunmao-ui/core';
import { CreateComponentBranchOperation } from '../branch';
import { BaseBranchOperation } from '../type';

export type PasteComponentBranchOperationContext = {
  parentId: string;
  slot: string;
  componentId: string;
};

export class PasteComponentBranchOperation extends BaseBranchOperation<PasteComponentBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    console.log('paste', this.context)
    // find component to remove
    const targetComponent = prev.find(c => c.id === this.context.componentId);
    if (!targetComponent) {
      console.warn('paste component not found');
      return prev;
    }
    // TODO: Change slot to target Parent
    // this.operationStack.insert(
    //   new CreateComponentBranchOperation({ componentId: component.id })
    // );

    // TODO: O(n2) in worst case. Optimize in the future.
    const children = prev.filter(c => {
      const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
      return (
        slotTrait &&
        (slotTrait.properties.container as { id: string }).id === this.context.componentId
      );
    });

    children.forEach(component => {
      this.operationStack.insert(
        new CreateComponentBranchOperation({
          componentId: `${component.id}_copy`,
          componentType: component.type,
          parentId: `${this.context.componentId}_copy`,
          slot: this.context.slot,
        })
      );
    });

    // TODO: dont care about layout component
    // if (parentId) {
    //   // modify layout property of parent grid layout component
    //   this.operationStack.insert(
    //     new ModifyComponentPropertiesLeafOperation({
    //       componentId: parentId,
    //       properties: {
    //         layout: (prev: Array<ReactGridLayout.Layout>) => {
    //           return produce(prev, draft => {
    //             const removeIndex = draft.findIndex(
    //               item => item.i === this.context.componentId
    //             );
    //             if (removeIndex === -1) {
    //               console.warn("parent element doesn' contain specific child");
    //             }
    //             draft.splice(removeIndex, 1);
    //           });
    //         },
    //       },
    //     })
    //   );
    // }

    // free component from schema
    this.operationStack.insert(
      new CreateComponentBranchOperation({
        componentId: `${this.context.componentId}_copy`,
        componentType: targetComponent.type,
        parentId: this.context.parentId,
        slot: this.context.slot,
      })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
