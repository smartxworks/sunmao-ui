import { JSONType, PropsDiffBlock } from './type';

export function mergeJSON(
  o: JSONType,
  a: JSONType,
  b: JSONType,
  path = ''
): PropsDiffBlock[] {
  const blocks: PropsDiffBlock[] = [];
  for (const oKey in o) {
    const oVal = o[oKey];
    const aVal = a[oKey];
    const bVal = b[oKey];
    if (oKey in a && oKey in b) {
      if (oVal === aVal && oVal === bVal) {
        // oab都在，且无变化
        blocks.push({
          kind: 'equal',
          key: oKey,
          value: oVal,
          path: `${path}.${oKey}`,
          // 相等的只可能是基本类型，所以无children
          children: [],
        });
        continue;
      }
      if (oVal !== aVal && oVal !== bVal && aVal !== bVal) {
        // oab都在，但不相等
        if (typeof aVal === 'object' && typeof bVal === 'object') {
          // 都是对象，进一步diff
          const diffBlocks = mergeJSON(oVal, aVal, bVal, `${path}.${oKey}`);
          const childrenHasConflict = propsDiffBlocksHasChange(diffBlocks);
          if (childrenHasConflict) {
            // 对象内有冲突
            blocks.push({
              kind: 'change',
              key: oKey,
              value: oVal,
              path: `${path}.${oKey}`,
              children: diffBlocks,
              childrenHasConflict: propsDiffBlocksHasChange(diffBlocks),
            });
          } else {
            // 对象内无冲突
            blocks.push({
              kind: 'equal',
              key: oKey,
              value: oVal,
              path: `${path}.${oKey}`,
              children: diffBlocks,
            });
          }
        } else {
          blocks.push({
            kind: 'conflict',
            key: oKey,
            oValue: oVal,
            aValue: aVal,
            bValue: bVal,
            path: `${path}.${oKey}`,
          });
        }
        continue;
      }
      if (oVal !== aVal && oVal === bVal) {
        // oab都在，a变，b不变
        blocks.push({
          kind: 'change',
          key: oKey,
          value: aVal,
          path: `${path}.${oKey}`,
          children: [],
          childrenHasConflict: false,
        });
        continue;
      }
      if (oVal === aVal && oVal !== bVal) {
        // oab都在，a不变，b变
        blocks.push({
          kind: 'change',
          key: oKey,
          value: bVal,
          path: `${path}.${oKey}`,
          children: [],
          childrenHasConflict: false,
        });
        continue;
      }
    } else if (notIn(oKey, a) && oKey in b) {
      // a 删了，b没删。b如果没变，那就相当于直接删了，不用插入block。
      if (bVal !== oVal) {
        // b变了
        blocks.push({
          kind: 'conflict',
          key: oKey,
          oValue: oVal,
          aValue: null,
          bValue: bVal,
          path: `${path}.${oKey}`,
        });
        continue;
      }
    } else if (notIn(oKey, b) && oKey in a) {
      // b 删了，a没删。a如果没变，那就相当于直接删了，不用插入block。
      if (aVal !== oVal) {
        // a变了
        blocks.push({
          kind: 'conflict',
          key: oKey,
          oValue: oVal,
          aValue: aVal,
          bValue: null,
          path: `${path}.${oKey}`,
        });
        continue;
      }
    } else if (notIn(oKey, b) && notIn(oKey, a)) {
      // ab都删了, 直接跳过
      continue;
    }
  }

  const aBlocks = findIncrement(o, a, b, path);
  const bBlocks = findIncrement(o, a, b, path, true);
  return blocks.concat(aBlocks).concat(bBlocks);
}

function findIncrement(
  o: JSONType,
  a: JSONType,
  b: JSONType,
  path = '',
  reverse = false
): PropsDiffBlock[] {
  const blocks: PropsDiffBlock[] = [];
  const target = reverse ? b : a;
  const another = reverse ? a : b;

  for (const aKey in target) {
    const oVal = o[aKey];
    const aVal = target[aKey];
    const bVal = another[aKey];
    if (notIn(aKey, o) && notIn(aKey, another)) {
      blocks.push({
        kind: 'equal',
        key: aKey,
        value: aVal,
        path: `${path}.${aKey}`,
        children: [],
      });
      continue;
    }

    // 如果反转了，就不需要对比ab都有value了，因为a已经比过了
    if (!reverse && notIn(aKey, o) && aKey in another) {
      if (typeof aVal === 'object' && typeof bVal === 'object') {
        // 都是对象，进一步diff
        const diffBlocks = mergeJSON(oVal, aVal, bVal);
        blocks.push({
          kind: 'change',
          key: aKey,
          value: aVal,
          path: `${path}.${aKey}`,
          children: diffBlocks,
          childrenHasConflict: propsDiffBlocksHasChange(diffBlocks),
        });
      } else if (aVal === bVal) {
        // 两者相等
        blocks.push({
          kind: 'equal',
          key: aKey,
          value: aVal,
          path: `${path}.${aKey}`,
          children: [],
        });
      } else {
        blocks.push({
          kind: 'conflict',
          key: aKey,
          oValue: oVal,
          aValue: aVal,
          bValue: bVal,
          path: `${path}.${aKey}`,
        });
      }
    }
  }
  return blocks;
}

function notIn(key: string, obj: object) {
  return !(key in obj);
}

export function propsDiffBlocksHasChange(blocks: PropsDiffBlock[]) {
  return blocks.some(
    block =>
      block.kind === 'conflict' || (block.kind === 'change' && block.childrenHasConflict)
  );
}
