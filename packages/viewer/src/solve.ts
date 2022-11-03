import { Application, ComponentSchema } from '@sunmao-ui/core';
import { ComponentHashMap, DiffBlock, PropsDiffBlock } from './type';

export type CheckedPropsMap = Record<string, 'a' | 'b'>;

export function solveApplication(params: {
  diffBlocks: DiffBlock[];
  hashMap: ComponentHashMap;
  solvedComponentsIdMap: Record<string, ComponentSchema>;
  checkedHashes: string[];
  appSkeleton: Application;
}) {
  const { diffBlocks, hashMap, solvedComponentsIdMap, checkedHashes, appSkeleton } =
    params;
  const components = diffBlocks.reduce((res, block) => {
    switch (block.kind) {
      case 'ok':
        return res.concat(block.hashes.map(hash => hashMap[hash]));
      case 'conflict':
        const checkedComponents = block.aHashes
          .concat(block.bHashes)
          .filter(hash => checkedHashes.includes(hash))
          .map(item => hashMap[item]);
        return res.concat(checkedComponents);
      case 'change':
        if (!block.hasConflict) {
          return res.concat([solveJson(block.diffBlocks, {})]);
        }
        if (checkedHashes.includes(block.hashA) && solvedComponentsIdMap[block.id]) {
          return res.concat([solvedComponentsIdMap[block.id]]);
        }
    }
    return res;
  }, [] as any[]);

  return {
    ...appSkeleton,
    spec: {
      ...appSkeleton.spec,
      components,
    },
  };
}

export function solveJson(
  blocks: PropsDiffBlock[],
  map: CheckedPropsMap
): Record<string, any> {
  const json: Record<string, any> = {};
  blocks.forEach(block => {
    switch (block.kind) {
      case 'equal':
        json[block.key] = block.value;
        break;
      case 'change':
        if (block.childrenHasConflict) {
          json[block.key] = solveJson(block.children, map);
        } else if (block.children.length > 0) {
          json[block.key] = solveJson(block.children, {});
        } else {
          json[block.key] = block.value;
        }
        break;
      case 'conflict':
        if (map[block.path] === 'a') {
          json[block.key] = block.aValue;
        } else {
          json[block.key] = block.bValue;
        }
    }
  });
  return json;
}
