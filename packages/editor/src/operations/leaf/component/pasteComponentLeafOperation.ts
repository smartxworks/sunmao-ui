import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';
import { RootId } from '../../../constants';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  component: IComponentModel;
};

let copyTimes = 0;

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private componentCopy!: IComponentModel;

  do(prev: AppModel): AppModel {
    this.context.component.allComponents.forEach(c => {
      c.changeId(`${c.id}_copy${copyTimes}` as ComponentId);
    });
    copyTimes++;

    this.componentCopy = this.context.component;

    return this.pasteComponent(prev);
  }

  redo(prev: AppModel): AppModel {
    return this.pasteComponent(prev);
  }

  undo(prev: AppModel): AppModel {
    prev.removeComponent(this.componentCopy.id);
    return prev;
  }

  private pasteComponent(prev: AppModel): AppModel {
    if (this.context.parentId === RootId) {
      prev.appendChild(this.componentCopy);
    } else {
      const targetParent = prev.getComponentById(this.context.parentId as ComponentId);
      if (targetParent && targetParent.slots.includes(this.context.slot as SlotName)) {
        targetParent.appendChild(this.componentCopy, this.context.slot as SlotName);
      }
    }
    return prev;
  }
}
