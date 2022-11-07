import { mergeApplication } from '../src/mergeApplication';
import o from './mocks/ComponentDiff/o.json';
import a from './mocks/ComponentDiff/a.json';
import b from './mocks/ComponentDiff/b.json';
import solvedApp from './mocks/ComponentDiff/solved.json';
import { Application } from '@sunmao-ui/core';
import { ConflictDiffBlock, OKDiffBlock } from '../src/type';
import { solveApplication } from '../src/solve';

describe('component level diff and merge', () => {
  const { diffBlocks, map, appSkeleton } = mergeApplication(
    o as Application,
    a as Application,
    b as Application
  );
  const block1 = diffBlocks[0] as OKDiffBlock;
  const block2 = diffBlocks[1] as ConflictDiffBlock;
  const block3 = diffBlocks[2] as OKDiffBlock;
  const block4 = diffBlocks[3] as ConflictDiffBlock;
  it(`detect component's conflicts`, () => {
    expect(diffBlocks.length).toEqual(4);
    expect(block1.kind).toEqual('ok');
    expect(block1.o.map(c => c.id)).toEqual(['stack1', 'text2', 'text3']);
    expect(block2.kind).toEqual('conflict');
    expect(block2.a.map(c => c.id)).toEqual(['input10']);
    expect(block2.b.map(c => c.id)).toEqual(['image11']);
    expect(block3.kind).toEqual('ok');
    expect(block3.o.map(c => c.id)).toEqual([
      'stack3',
      'button9',
      'text6',
      'stack4',
      'text8',
    ]);
    expect(block4.kind).toEqual('conflict');
    expect(block4.a.map(c => c.id)).toEqual(['text7']);
    expect(block4.b.map(c => c.id)).toEqual(['text12']);
  });

  it(`solve component's conflicts`, () => {
    const newAPP = solveApplication({
      diffBlocks,
      hashMap: map,
      solvedComponentsIdMap: {},
      checkedHashes: block2.aHashes
        .concat(block2.bHashes)
        .concat(block4.aHashes)
        .concat(block4.bHashes),
      appSkeleton,
    });
    expect(newAPP).toEqual(solvedApp);
  });
});
