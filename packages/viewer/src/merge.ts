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

type OKDiffBlock = {
  kind: 'ok';
  o: ComponentSchema<unknown>[];
  hashes: string[];
};
type ConflictDiffBlock = {
  kind: 'conflict';
  a: ComponentSchema<unknown>[];
  b: ComponentSchema<unknown>[];
  aHashes: string[];
  bHashes: string[];
};
type ChangeDiffBlock = {
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

    const block: ConflictDiffBlock = {
      kind: 'conflict',
      aHashes: conflict.a,
      bHashes: conflict.b,
      a: conflict.a
        .filter(hash =>
          blocks.find(block => block.kind === 'change' && block.hashA !== hash)
        )
        .map(hash => map[hash]),
      b: conflict.a
        .filter(hash =>
          blocks.find(block => block.kind === 'change' && block.hashB !== hash)
        )
        .map(hash => map[hash]),
    };

    blocks.push(block);
  }

  return blocks;
}
