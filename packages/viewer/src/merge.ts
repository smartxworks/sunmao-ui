import { diffArrays } from 'diff';
import { isEqual } from 'lodash';
import { Application } from '@sunmao-ui/core';
import * as Diff3 from 'node-diff3';

export function merge(o: Application, a: Application, b: Application) {
  // function hashStr(str: string) {
  //   let hash = 0;
  //   let i = 0;
  //   let chr = 0;
  //   if (str.length === 0) return hash;
  //   for (i = 0; i < str.length; i++) {
  //     chr = str.charCodeAt(i);
  //     hash = (hash << 5) - hash + chr;
  //     hash |= 0; // Convert to 32bit integer
  //   }
  //   return hash;
  // }

  const BaseComponents = o.spec.components;
  const V1Components = a.spec.components;
  const V2Components = b.spec.components;

  console.log(diffArrays);

  const map: Record<string, any> = {};

  const BaseHashes = BaseComponents.map(c => {
    map[c.id] = c;
    return c.id;
  });
  const V1Hashes = V1Components.map(c => {
    map[c.id] = c;
    return c.id;
  });
  const V2Hashes = V2Components.map(c => {
    map[c.id] = c;
    return c.id;
  });

  console.log(BaseHashes);
  console.log(V1Hashes);
  console.log(V2Hashes);

  const v1Diff = diffArrays(BaseHashes, V1Hashes, {
    comparator: (left, right) => {
      return isEqual(left, right);
    },
  });
  const v2Diff = diffArrays(BaseHashes, V2Hashes, {
    comparator: (left, right) => {
      return isEqual(left, right);
    },
  });

  console.log(v1Diff);
  console.log(v2Diff);

  const mergeRegion = Diff3.diff3Merge(V1Hashes, BaseHashes, V2Hashes);
  console.log('mergeRegion', mergeRegion);
  return { mergeRegion, map };
}
