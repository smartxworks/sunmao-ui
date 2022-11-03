import { ComponentSchema } from '@sunmao-ui/core';

export type ComponentHashMap = Record<string, ComponentSchema<any>>;

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
  diffBlocks: PropsDiffBlock[];
  hasConflict: boolean;
};

export type DiffBlock = OKDiffBlock | ConflictDiffBlock | ChangeDiffBlock;

export type JSONType = Record<string, any>;

export type PropsEqualDiffBlock = {
  kind: 'equal';
  key: string;
  value: any;
  path: string;
  children: PropsDiffBlock[];
};

export type PropsChangeDiffBlock = {
  kind: 'change';
  key: string;
  path: string;
  value: any;
  children: PropsDiffBlock[];
  childrenHasConflict: boolean;
};

export type PropsConflictDiffBlock = {
  kind: 'conflict';
  key: string;
  oValue: any;
  aValue: any;
  bValue: any;
  path: string;
};

export type PropsDiffBlock =
  | PropsEqualDiffBlock
  | PropsChangeDiffBlock
  | PropsConflictDiffBlock;
