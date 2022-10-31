import { PropsBlock } from './merge';

export type CheckedPropsMap = Record<string, 'a' | 'b'>;

export function restoreJson(
  blocks: PropsBlock[],
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
