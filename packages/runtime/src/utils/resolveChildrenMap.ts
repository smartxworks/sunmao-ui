import { RuntimeComponentSchema } from '@sunmao-ui/core';
import { ChildrenMap } from '../types';
import { isFetchTraitComponent } from '../utils/trait';

export function resolveChildrenMap(components: RuntimeComponentSchema[]): {
  childrenMap: ChildrenMap<string>;
  topLevelComponents: RuntimeComponentSchema[];
} {
  const childrenMap: ChildrenMap<string> = {};
  const topLevelComponents: RuntimeComponentSchema[] = [];
  const fetchTraitComponents: RuntimeComponentSchema[] = [];

  for (const c of components) {
    const slotTrait = c.traits.find(t => t.parsedType.name === 'slot');
    if (!slotTrait) {
      if (isFetchTraitComponent(c)) {
        fetchTraitComponents.push(c);
      } else {
        topLevelComponents.push(c);
      }
      continue;
    }
    const { id, slot } = slotTrait.properties.container as any;
    if (!childrenMap[id]) {
      childrenMap[id] = {
        _allChildren: [],
      };
    }
    const children = childrenMap[id];
    if (!children[slot]) {
      children[slot] = [];
    }
    children[slot].push(c);
    children._allChildren.push(c);
  }

  // get allChildren and grand children
  function getAllChildren(id: string): RuntimeComponentSchema[] {
    if (!childrenMap[id]) {
      return [];
    }
    if (childrenMap[id]?._grandChildren) {
      return childrenMap[id]._grandChildren!;
    }
    const children = childrenMap[id];

    childrenMap[id]._grandChildren = children._allChildren.reduce((res, curr) => {
      const cccc = getAllChildren(curr.id);
      return res.concat(cccc);
    }, children._allChildren);

    return childrenMap[id]._grandChildren!;
  }

  for (const id in childrenMap) {
    childrenMap[id]._grandChildren = getAllChildren(id);
    Object.defineProperty(childrenMap[id], '_allChildren', {
      enumerable: false,
    });
    Object.defineProperty(childrenMap[id], '_grandChildren', {
      enumerable: false,
    });
  }

  return {
    childrenMap,
    topLevelComponents: [...topLevelComponents, ...fetchTraitComponents],
  };
}
