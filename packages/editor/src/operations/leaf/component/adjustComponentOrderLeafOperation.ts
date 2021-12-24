import { ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationModel } from '../../AppModel/AppModel';
import { ComponentId } from '../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';
export type AdjustComponentOrderLeafOperationContext = {
  orientation: 'up' | 'down';
  componentId: string;
};

export class AdjustComponentOrderLeafOperation extends BaseLeafOperation<AdjustComponentOrderLeafOperationContext> {
  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.move(prev, this.context.orientation);
  }
  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.do(prev)
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return this.move(prev, this.context.orientation === 'up' ? 'down' : 'up');
  }

  private move(prev: ApplicationComponent[], orientation: 'up' | 'down'): ApplicationComponent[] {
    const appModel = new ApplicationModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    switch (orientation) {
      case 'up':
        console.log('component.prevSilbling', component.prevSilbling)
        if (!component.prevSilbling) {
          console.warn('destination index out of bound');
          return prev;
        }
        component.moveAfter(component.prevSilbling?.prevSilbling || null);
        break;
      case 'down':
        if (!component.nextSilbing) {
          console.warn('destination index out of bound');
          return prev;
        }
        component.moveAfter(component.nextSilbing || null);
        break;
    }
    return appModel.toSchema();
  }
}
