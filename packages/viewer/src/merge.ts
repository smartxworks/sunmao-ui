import { Application, ComponentSchema } from '@sunmao-ui/core';
import { flatten } from 'lodash';
import * as Diff3 from 'node-diff3';

const HashDivider = `@@`;

type HashMap = Record<string, ComponentSchema<unknown>>;
export function merge(o: Application, a: Application, b: Application) {
  function hashComponent(component: ComponentSchema<unknown>): string {
    const json = JSON.stringify(component);
    let hash = 0;
    let i = 0;
    let chr = 0;
    if (json.length === 0) return `${hash}`;
    for (i = 0; i < json.length; i++) {
      chr = json.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return `${component.id}${HashDivider}${hash}`;
  }

  const map: HashMap = {};

  const oHashed = o.spec.components.map(c => {
    const hash = hashComponent(c);
    map[hash] = c;
    return hash;
  });
  const aHashed = a.spec.components.map(c => {
    const hash = hashComponent(c);
    map[hash] = c;
    return hash;
  });
  const bHashed = b.spec.components.map(c => {
    const hash = hashComponent(c);
    map[hash] = c;
    return hash;
  });

  console.log(oHashed);
  console.log(aHashed);
  console.log(bHashed);

  // const aDiff = diffArrays(oHashed, aHashed, {
  //   comparator: (left, right) => {
  //     return isEqual(left, right);
  //   },
  // });
  // const bDiff = diffArrays(oHashed, bHashed, {
  //   comparator: (left, right) => {
  //     return isEqual(left, right);
  //   },
  // });

  // console.log(aDiff);
  // console.log(bDiff);

  const mergeRegion = Diff3.diff3Merge(aHashed, oHashed, bHashed);
  console.log('mergeRegion', mergeRegion);
  const formatted = flatten(mergeRegion.map(r => formatRegion(r, map)));
  console.log('formatted', formatted);
  return { mergeRegion: formatted, map };
}

export type OKDiffBlock = {
  kind: 'ok';
  o: ComponentSchema<unknown>[];
  hashes: string[];
};
export type ConflictDiffBlock = {
  kind: 'conflict';
  a: ComponentSchema<unknown>[];
  b: ComponentSchema<unknown>[];
  aHashes: string[];
  bHashes: string[];
};
export type ChangeDiffBlock = {
  kind: 'change';
  hashA: string;
  hashB: string;
  id: string;
  o: ComponentSchema<unknown>;
  a: ComponentSchema<unknown>;
  b: ComponentSchema<unknown>;
  merged: ComponentSchema<unknown>;
};

export type DiffBlock = OKDiffBlock | ConflictDiffBlock | ChangeDiffBlock;

export function formatRegion(
  region: Diff3.MergeRegion<string>,
  map: HashMap
): DiffBlock[] {
  if (region.ok) {
    const block: OKDiffBlock = {
      kind: 'ok',
      o: region.ok.map(hash => map[hash]),
      hashes: region.ok,
    };
    return [block];
  }
  const blocks: DiffBlock[] = [];
  if (region.conflict) {
    const conflict = region.conflict;
    // const aIds = conflict.a.map(hash => hash.split(HashDivider)[0]);
    // const bIds = conflict.b.map(hash => hash.split(HashDivider)[0]);
    let ca = 0;
    let cb = 0;
    while (conflict.a[ca] || conflict.b[ca]) {
      const hashA = conflict.a[ca];
      const hashB = conflict.b[cb];
      const hashO = conflict.o[cb];
      const idA = hashA.split(HashDivider)[0];
      const idB = hashB.split(HashDivider)[0];
      if (idA === idB) {
        const block: ChangeDiffBlock = {
          kind: 'change',
          hashA: hashA,
          hashB: hashB,
          id: idA,
          o: map[hashO],
          a: map[hashA],
          b: map[hashB],
          // TODO：暂时全用 A 版本
          merged: map[hashA],
        };
        blocks.push(block);
        ca++;
        cb++;
      }
    }

    const restAHashes = conflict.a.filter(
      hash => !blocks.find(block => block.kind === 'change' && block.hashA === hash)
    );
    const restBHashes = conflict.b.filter(
      hash => !blocks.find(block => block.kind === 'change' && block.hashB === hash)
    );

    if (restAHashes.length || restBHashes.length) {
      const block: ConflictDiffBlock = {
        kind: 'conflict',
        aHashes: restAHashes,
        bHashes: restBHashes,
        a: restAHashes.map(hash => map[hash]),
        b: restBHashes.map(hash => map[hash]),
      };

      blocks.push(block);
    }
  }

  return blocks;
}

type PropsOkBlock = {
  kind: 'ok';
  key: string;
  value: any;
  path: string;
  children: PropsBlock[];
  hasChange?: boolean;
};

type PropsConflictBlock = {
  kind: 'conflict';
  key: string;
  oValue: any;
  aValue: any;
  bValue: any;
  path: string;
};

export type PropsBlock = PropsOkBlock | PropsConflictBlock;
export function mergeJSON(
  o: Record<string, any>,
  a: Record<string, any>,
  b: Record<string, any>,
  path = ''
): PropsBlock[] {
  const blocks: PropsBlock[] = [];
  for (const oKey in o) {
    const oVal = o[oKey];
    const aVal = a[oKey];
    const bVal = b[oKey];
    if (oKey in a && oKey in b) {
      if (oVal === aVal && oVal === bVal) {
        // oab都在，且无变化
        blocks.push({
          kind: 'ok',
          key: oKey,
          value: oVal,
          path: `${path}.${oKey}`,
          // TODO: 暂时无嵌套
          children: [],
        });
        continue;
      }
      if (oVal !== aVal && oVal !== bVal && aVal !== bVal) {
        // oab都在，但不相等
        if (typeof aVal === 'object' && typeof bVal === 'object') {
          const merged = mergeJSON(oVal, aVal, bVal, `${path}.${oKey}`);
          // 都是对象，进一步diff
          blocks.push({
            kind: 'ok',
            key: oKey,
            value: aVal,
            path: `${path}.${oKey}`,
            children: merged,
            hasChange: merged.some(block => block.kind === 'conflict' || block.hasChange),
          });
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
          kind: 'ok',
          key: oKey,
          value: aVal,
          path: `${path}.${oKey}`,
          children: [],
        });
        continue;
      }
      if (oVal === aVal && oVal !== bVal) {
        // oab都在，a不变，b变
        blocks.push({
          kind: 'ok',
          key: oKey,
          value: bVal,
          path: `${path}.${oKey}`,
          children: [],
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
  o: Record<string, any>,
  a: Record<string, any>,
  b: Record<string, any>,
  path = '',
  reverse = false
): PropsBlock[] {
  const blocks: PropsBlock[] = [];
  const target = reverse ? b : a;

  for (const aKey in target) {
    const oVal = o[aKey];
    const aVal = a[aKey];
    const bVal = b[aKey];
    if (notIn(aKey, o) && notIn(aKey, b)) {
      blocks.push({
        kind: 'ok',
        key: aKey,
        value: aVal,
        path: `${path}.${aKey}`,
        children: [],
      });
      continue;
    }

    if (notIn(aKey, o) && aKey in b) {
      if (typeof aVal === 'object' && typeof bVal === 'object') {
        // 都是对象，进一步diff
        blocks.push({
          kind: 'ok',
          key: aKey,
          value: aVal,
          path: `${path}.${aKey}`,
          children: mergeJSON(oVal, aVal, bVal),
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
