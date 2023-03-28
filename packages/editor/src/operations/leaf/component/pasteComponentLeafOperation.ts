import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId, IComponentModel, SlotName } from '../../../AppModel/IAppModel';
import { BaseLeafOperation } from '../../type';
import { RootId } from '../../../constants';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  component: IComponentModel;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private componentCopy!: IComponentModel;

  do(prev: AppModel): AppModel {
    let copyTimes = 0;
    const ids = prev.allComponents.map(c => c.id);
    this.context.component.allComponents.forEach(c => {
      let copyId = `${c.id}_copy${copyTimes}`;
      while (ids.includes(copyId as ComponentId)) {
        copyTimes++;
        copyId = `${c.id}_copy${copyTimes}`;
      }
      c.changeId(copyId as ComponentId);
    });

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
