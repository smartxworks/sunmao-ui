import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderLeafOperationContext = {
  componentId: ComponentId;
  targetId?: ComponentId;
  direction: 'prev' | 'next';
};

export class AdjustComponentOrderLeafOperation extends BaseLeafOperation<AdjustComponentOrderLeafOperationContext> {
  private prevComponentId?: ComponentId;
  do(prev: AppModel): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    this.prevComponentId = component?.prevSibling?.id;
    return this.move(prev, this.context.targetId, this.context.direction);
  }

  redo(prev: AppModel): AppModel {
    return this.do(prev);
  }

  undo(prev: AppModel): AppModel {
    return this.move(prev, this.prevComponentId!, 'next');
  }

  private move(
    prev: AppModel,
    targetId: ComponentId | undefined,
    direction: 'prev' | 'next'
  ): AppModel {
    const component = prev.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }
    const targetComponent = prev.getComponentById(targetId as ComponentId);

    switch (direction) {
      case 'prev':
        component.moveAfter(targetComponent?.prevSibling || null);
        break;
      case 'next':
        component.moveAfter(targetComponent || null);
        break;
    }
    return prev;
  }
}
