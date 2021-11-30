import { ApplicationComponent } from '@sunmao-ui/core';
import { eventBus } from '../../eventBus';
import { BaseLeafOperation } from '../type';

export type UpdateSelectComponentLeafOperationContext = {
  componentId?: string;
  newId: string;
};

export class UpdateSelectComponentLeafOperation extends BaseLeafOperation<UpdateSelectComponentLeafOperationContext> {
  private prevId!: string;
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    this.prevId = this.context.componentId || prev[0].id;
    setTimeout(() => {
      eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    setTimeout(() => {
      eventBus.send('selectComponent', this.context.newId);
    });
    return prev;
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    setTimeout(() => {
      eventBus.send('selectComponent', this.prevId);
    });
    return prev;
  }
}
