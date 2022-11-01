import { Application, ComponentSchema } from '@sunmao-ui/core';
import { ComponentHashMap, DiffBlock, PropsDiffBlock } from './type';

export type CheckedPropsMap = Record<string, 'a' | 'b'>;

export function restoreApplication(params: {
  diffBlocks: DiffBlock[];
  hashMap: ComponentHashMap;
  solvedComponentsIdMap: Record<string, ComponentSchema>;
  checkedHashes: string[];
  appSkeleton: Application;
}) {
  const { diffBlocks, hashMap, solvedComponentsIdMap, checkedHashes, appSkeleton } =
    params;
  const components = diffBlocks.reduce((res, block) => {
    if (block.kind === 'ok') {
      return res.concat(block.hashes.map(hash => hashMap[hash]));
    }
    if (block.kind === 'conflict') {
      console.log('checkedHashes', checkedHashes);
      const checkedComponents = block.aHashes
        .concat(block.bHashes)
        .filter(hash => checkedHashes.includes(hash))
        .map(item => hashMap[item]);
      return res.concat(checkedComponents);
    }
    if (block.kind === 'change') {
      if (checkedHashes.includes(block.hashA) && solvedComponentsIdMap[block.id]) {
        console.log('solvedComponentsIdMap', solvedComponentsIdMap);
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

export function restoreJson(
  blocks: PropsDiffBlock[],
  map: CheckedPropsMap
): Record<string, any> {
  const json: Record<string, any> = {};
  blocks.forEach(block => {
    switch (block.kind) {
      case 'ok':
        if (block.hasChange) {
          json[block.key] = restoreJson(block.children, map);
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
