import { ComponentSchema } from '@sunmao-ui/core';
import produce from 'immer';
import { AppModel } from '../../AppModel/AppModel';
import { ComponentId } from '../../AppModel/IAppModel';
import {
  ModifyComponentPropertiesLeafOperation,
  RemoveComponentLeafOperation,
} from '../leaf';
import { BaseBranchOperation } from '../type';

export type RemoveComponentBranchOperationContext = {
  componentId: string;
};

export class RemoveComponentBranchOperation extends BaseBranchOperation<RemoveComponentBranchOperationContext> {
  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const parent = appModel.getComponentById(this.context.componentId as ComponentId);

    if (parent && parent.type === 'core/v1/grid_layout') {
      // modify layout property of parent grid layout component
      this.operationStack.insert(
        new ModifyComponentPropertiesLeafOperation({
          componentId: parent.id,
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
      new RemoveComponentLeafOperation({ componentId: this.context.componentId })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
