import produce from 'immer';
import ReactGridLayout from 'react-grid-layout';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
import {
  ModifyComponentPropertiesLeafOperation,
  RemoveComponentLeafOperation,
} from '../../leaf';
import { BaseBranchOperation } from '../../type';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';

export type RemoveComponentBranchOperationContext = {
  componentId: string;
};

export class RemoveComponentBranchOperation extends BaseBranchOperation<RemoveComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const parent = prev.getComponentById(this.context.componentId as ComponentId);

    if (parent && parent.type === `${CORE_VERSION}/${CoreComponentName.GridLayout}`) {
      // modify layout property of parent grid layout component
      this.operationStack.insert(
        new ModifyComponentPropertiesLeafOperation(this.registry, {
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
      new RemoveComponentLeafOperation(this.registry, { componentId: this.context.componentId })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
