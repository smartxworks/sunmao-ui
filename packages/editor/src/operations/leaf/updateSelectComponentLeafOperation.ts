import { ComponentSchema } from '@sunmao-ui/core';
import { eventBus } from '../../eventBus';
import { BaseLeafOperation } from '../type';

export type UpdateSelectComponentLeafOperationContext = {
  componentId?: string;
  newId: string;
};

export class UpdateSelectComponentLeafOperation extends BaseLeafOperation<UpdateSelectComponentLeafOperationContext> {
  private prevId!: string;
  do(prev: ComponentSchema[]): ComponentSchema[] {
    this.prevId = this.context.componentId || prev[0].id;
    setTimeout(() => {
      eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  redo(prev: ComponentSchema[]): ComponentSchema[] {
    setTimeout(() => {
      eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  undo(prev: ComponentSchema[]): ComponentSchema[] {
    setTimeout(() => {
      eventBus.send('selectComponent', this.prevId);
    });
    return prev;
  }
}
