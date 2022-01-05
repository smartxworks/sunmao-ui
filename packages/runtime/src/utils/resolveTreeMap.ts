import { flatten } from 'lodash-es';
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
      topLevelComponents.push(c);
      continue;
    }
    const { id, slot } = slotTrait.properties.container as any;
    if (!treeMap[id]) {
      treeMap[id] = {
        _allChildren: []
      };
    }
    const children = treeMap[id];
    if (!children[slot]) {
      children[slot] = [];
    }
    children[slot].push(c);
    children._allChildren.push(c)
  }

  // get allChildren and grand children
  function getAllChildren(id: string): RuntimeApplicationComponent[] {
    if (!treeMap[id]) {
      return [];
    }
    if (treeMap[id]?._grandChildren) {
      return treeMap[id]._grandChildren!;
    }
    const children = treeMap[id];

    treeMap[id]._grandChildren = children._allChildren.reduce((res, curr) => {
      const cccc = getAllChildren(curr.id);
      return res.concat(cccc);
    }, children._allChildren);

    return treeMap[id]._grandChildren!;
  }

  for (const id in treeMap) {
    treeMap[id]._grandChildren = getAllChildren(id);
    Object.defineProperty(treeMap[id], '_allChildren', {
      enumerable: false,
    });
    Object.defineProperty(treeMap[id], '_grandChildren', {
      enumerable: false,
    });
  }

  return {
    treeMap,
    topLevelComponents,
  };
}
