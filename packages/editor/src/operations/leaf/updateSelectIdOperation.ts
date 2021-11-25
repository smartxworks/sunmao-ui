import { Application } from '@sunmao-ui/core';
import { eventBus, SelectComponentEvent } from '../../eventBus';
import { BaseLeafOperation } from '../type';

export type UpdateSelectIdOperationContext = {
  componentId?: string;
  newId: string;
};

export class UpdateSelectIdOperation extends BaseLeafOperation<UpdateSelectIdOperationContext> {
  private prevId!: string;
  do(prev: Application): Application {
    this.prevId = this.context.componentId || prev.spec.components[0].id;
    setTimeout(() => {
      eventBus.send(SelectComponentEvent, this.context.newId);
    });
    return prev;
  }

  redo(prev: Application): Application {
    setTimeout(() => {
      eventBus.send(SelectComponentEvent, this.context.newId);
    });
    return prev;
  }

  undo(prev: Application): Application {
    setTimeout(() => {
      eventBus.send(SelectComponentEvent, this.prevId);
    });
    return prev;
  }
}
