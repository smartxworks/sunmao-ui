import { RuntimeApplicationComponent, TreeMap } from '../types/RuntimeSchema';

export function resolveTreeMap(components: RuntimeApplicationComponent[]): {
  treeMap: TreeMap<string>;
  topLevelComponents: RuntimeApplicationComponent[];
} {
  const treeMap: TreeMap<string> = {};
  const topLevelComponents: RuntimeApplicationComponent[] = [];

  for (const c of components) {
    const slotTrait = c.traits.find(t => t.parsedType.name === 'slot');
    if (!slotTrait) {
      topLevelComponents.push(c)
      continue;
    }
    const { id, slot } = slotTrait.properties.container as any;
    if (!treeMap[id]) {
      treeMap[id] = {};
    }
    const children = treeMap[id];
    if (!children[slot]) {
      children[slot] = [];
    }
    const slotChildren = children[slot];
    slotChildren.push(c);
  }
  return {
    treeMap,
    topLevelComponents,
  };
}
