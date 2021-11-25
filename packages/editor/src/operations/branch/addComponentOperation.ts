import { Application } from '@sunmao-ui/core';
import produce from 'immer';
import { ModifyComponentPropertiesOperation } from '../leaf/component/modifyPropertiesOperation';
import { NewComponentOperation } from '../leaf/component/newOperation';
import { NewTraitOperation } from '../leaf/trait/newOperation';
import { BaseBranchOperation } from '../type';
import { genId } from '../util';

export type AddComponentOperationContext = {
  componentType: string;
  componentId?: string;
  slot?: string;
  parentId?: string;
  layout?: ReactGridLayout.Layout[];
};

export class AddComponentOperation extends BaseBranchOperation<AddComponentOperationContext> {
  do(prev: Application): Application {
    // gen component id
    if (!this.context.componentId) {
      this.context.componentId = genId(this.context.componentType, prev);
    }
    // insert a new component to spec
    this.operationStack.insert(
      new NewComponentOperation({
        componentId: this.context.componentId!,
        componentType: this.context.componentType,
      })
    );
    // add a slot trait if it has a parent
    if (this.context.parentId && this.context.slot) {
      // try to find parent
      const parentComponent = prev.spec.components.find(
        c => c.id === this.context.parentId
      );

      // add a slot trait if it has a direct child
      this.operationStack.insert(
        new NewTraitOperation({
          traitType: 'core/v1/slot',
          properties: {
            container: {
              id: this.context.parentId,
              slot: this.context.slot,
            },
          },
          componentId: this.context.componentId,
        })
      );
      if (!parentComponent) {
        console.warn("insert element has an invalid parent, it won't show in the view");
      } else if (parentComponent.type === 'core/v1/grid_layout') {
        this.operationStack.insert(
          // update grid layout for the new created component, it was pushed into layout by react-grid-layout, so we need to find it and update its id
          new ModifyComponentPropertiesOperation({
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
