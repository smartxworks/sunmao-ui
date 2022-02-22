import { AppModel } from '../../../AppModel/AppModel';
import ReactGridLayout from 'react-grid-layout';
import produce from 'immer';
import { ComponentId, ComponentType, SlotName } from '../../../AppModel/IAppModel';
import {
  AdjustComponentOrderLeafOperation,
  CreateComponentLeafOperation,
  ModifyComponentPropertiesLeafOperation,
} from '../../leaf';
import { BaseBranchOperation } from '../../type';

export type CreateComponentBranchOperationContext = {
  componentType: string;
  componentId?: string;
  slot?: string;
  parentId?: string;
  layout?: ReactGridLayout.Layout[];
  targetId?: string;
  direction?: 'prev' | 'next';
};

export class CreateComponentBranchOperation extends BaseBranchOperation<CreateComponentBranchOperationContext> {
  do(prev: AppModel): AppModel {
    // gen component id
    if (!this.context.componentId) {
      this.context.componentId = prev.genId(this.context.componentType as ComponentType);
    }
    // insert a new component to schema
    this.operationStack.insert(
      new CreateComponentLeafOperation(this.registry, {
        componentId: this.context.componentId!,
        componentType: this.context.componentType,
        parentId: this.context.parentId as ComponentId,
        slot: this.context.slot as SlotName,
      })
    );
    // add a slot trait if it has a parent
    if (this.context.parentId && this.context.slot) {
      // try to find parent
      const parentComponent = prev.getComponentById(this.context.parentId as ComponentId);

      if (!parentComponent) {
        console.warn("insert element has an invalid parent, it won't show in the view");
      } else if (parentComponent.type === 'core/v1/grid_layout') {
        this.operationStack.insert(
          // update grid layout for the new created component, it was pushed into layout by react-grid-layout, so we need to find it and update its id
          new ModifyComponentPropertiesLeafOperation(this.registry, {
            componentId: parentComponent.id,
            properties: {
              layout: (prev: Array<ReactGridLayout.Layout>) => {
                const newLayout = produce(prev, () => {
                  // find dropping element
                  if (!this.context.layout) {
                    prev.push({
                      i: this.context.componentId!,
                      x: 0,
                      y: 0,
                      w: 0,
                      h: 0,
                    });
                    return prev;
                  }
                  const layout = this.context.layout.find(
                    layout => layout.i === '__dropping-elem__'
                  );
                  if (layout) {
                    layout.i = this.context.componentId!;
                  } else {
                    console.warn('layout was not updated');
                    this.context.layout.push({
                      i: this.context.componentId!,
                      x: 0,
                      y: 0,
                      w: 0,
                      h: 0,
                    });
                  }
                  return this.context.layout;
                });
                // update layout in context
                this.context.layout = newLayout;
                return newLayout;
              },
            },
          })
        );
      }
    }

    if (this.context.direction) {
      this.operationStack.insert(
        new AdjustComponentOrderLeafOperation(this.registry, {
          componentId: this.context.componentId as ComponentId,
          targetId: this.context.targetId as ComponentId,
          direction: this.context.direction,
        })
      );
    }

    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
