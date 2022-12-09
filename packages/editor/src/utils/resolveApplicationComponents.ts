import { ComponentSchema } from '@sunmao-ui/core';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ComponentSchema[]>;

export function resolveApplicationComponents(components: ComponentSchema[]): {
  topLevelComponents: ComponentSchema[];
  childrenMap: ChildrenMap;
} {
  const topLevelComponents: ComponentSchema[] = [];
  const childrenMap: ChildrenMap = new Map();
  components.forEach(c => {
    const slotTrait = c.traits.find(
      t =>
        t.type === `${CORE_VERSION}/${CoreTraitName.Slot}` ||
        t.type === `core/v2/${CoreTraitName.Slot}`
    );
    if (slotTrait) {
      const { id: parentId, slot } = slotTrait.properties.container as any;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, new Map());
      }
      if (!childrenMap.get(parentId)?.has(slot)) {
        childrenMap.get(parentId)?.set(slot, []);
      }

      childrenMap.get(parentId)!.get(slot)!.push(c);
    } else {
      topLevelComponents.push(c);
    }
  });
  return {
    topLevelComponents,
    childrenMap,
  };
}
