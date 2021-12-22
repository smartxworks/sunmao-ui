import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { ComponentId, SlotName } from '../AppModel/IAppModel';
import {
  CreateComponentLeafOperation,
  ModifyComponentPropertiesLeafOperation,
} from '../leaf';
import { BaseBranchOperation } from '../type';
import { genId } from '../util';

export type CreateComponentBranchOperationContext = {
  componentType: string;
  componentId?: string;
  slot?: string;
  parentId?: string;
  layout?: ReactGridLayout.Layout[];
};

export class CreateComponentBranchOperation extends BaseBranchOperation<CreateComponentBranchOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    // gen component id
    if (!this.context.componentId) {
      this.context.componentId = genId(this.context.componentType, prev);
    }
    // insert a new component to schema
    this.operationStack.insert(
      new CreateComponentLeafOperation({
        componentId: this.context.componentId!,
        componentType: this.context.componentType,
        parentId: this.context.parentId as ComponentId,
        slot: this.context.slot as SlotName,
      })
    );
    // add a slot trait if it has a parent
    if (this.context.parentId && this.context.slot) {
      // try to find parent
      const parentComponent = prev.find(
        c => c.id === this.context.parentId
      );

      if (!parentComponent) {
        console.warn("insert element has an invalid parent, it won't show in the view");
      } else if (parentComponent.type === 'core/v1/grid_layout') {
        this.operationStack.insert(
          // update grid layout for the new created component, it was pushed into layout by react-grid-layout, so we need to find it and update its id
          new ModifyComponentPropertiesLeafOperation({
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
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
