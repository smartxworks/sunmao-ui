import { ApplicationComponent } from '@sunmao-ui/core';
import produce from 'immer';
import { get } from 'lodash-es';
import { resolveApplicationComponents } from '../../../utils/resolveApplicationComponents';
import { BaseLeafOperation } from '../../type';

export type PasteComponentLeafOperationContext = {
  parentId: string;
  slot: string;
  components: ApplicationComponent[];
  copyTimes: number;
};

export class PasteComponentLeafOperation extends BaseLeafOperation<PasteComponentLeafOperationContext> {
  private pastedComponents: ApplicationComponent[] = [];

  do(prev: ApplicationComponent[]): ApplicationComponent[] {
    const { childrenMap } = resolveApplicationComponents(
      this.context.components
    );

    const rootTrait = this.context.components[0].traits.find(
      trait => trait.type === 'core/v1/slot'
    );
    const rootParentId = get(rootTrait, 'properties.container.id');

    // map of old parentId to new parentId
    const newIdMap: Record<string, string> = { [rootParentId]: this.context.parentId };
    this.context.components.forEach(({ id }) => {
      if (prev.find(c => c.id === id)) {
        newIdMap[id] = `${id}_copy${this.context.copyTimes}`;
      } else {
        newIdMap[id] = id;
      }
    });

    // update components slot
    childrenMap.forEach((slotMap, parentId) => {
      slotMap.forEach((children, slot) => {
        const newChildren = children.map(c => {
          const newComponent = updateComponentSlot(c, newIdMap[parentId], slot);
          return produce(newComponent, draft => {
            draft.id = newIdMap[c.id] || c.id;
          });
        });
        this.pastedComponents = this.pastedComponents.concat(newChildren);
      });
    });


    return prev.concat(this.pastedComponents);
  }

  redo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return prev.concat(this.pastedComponents);
  }

  undo(prev: ApplicationComponent[]): ApplicationComponent[] {
    return produce(prev, draft => {
      draft.splice(-this.pastedComponents.length);
    });
  }
}

function updateComponentSlot(
  component: ApplicationComponent,
  parentId: string,
  slot: string
) {
  return produce(component, draft => {
    const newSlotTrait = {
      type: 'core/v1/slot',
      properties: { container: { id: parentId, slot } },
    };
    const oldSlotIndex = draft.traits.findIndex(trait => trait.type === 'core/v1/slot');
    if (oldSlotIndex === -1) {
      draft.traits.push(newSlotTrait);
    } else {
      draft.traits[oldSlotIndex] = newSlotTrait;
    }
  });
  return component;
}
