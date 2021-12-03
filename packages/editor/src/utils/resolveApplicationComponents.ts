import { ApplicationComponent } from '@sunmao-ui/core';

export type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, ApplicationComponent[]>;

// similar to resolveAppComponents
export function resolveApplicationComponents(components: ApplicationComponent[]): {
  topLevelComponents: ApplicationComponent[];
  childrenMap: ChildrenMap;
} {
  const topLevelComponents: ApplicationComponent[] = [];
  const childrenMap: ChildrenMap = new Map();
  components.forEach(c => {
    const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
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
    childrenMap
  }
}
