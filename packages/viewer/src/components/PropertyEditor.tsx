import React from 'react';
import { css } from '@emotion/css';
import { flatten } from 'lodash';
import { Tree as ArcoTree, TreeNodeProps } from '@arco-design/web-react';
import { PropsDiffBlock } from '../type';

export type PropsConflictMap = Record<string, 'a' | 'b'>;

export type TreeDataType = TreeNodeProps & {
  key?: string;
  _index?: number;
  children?: TreeDataType[];
  [key: string]: any;
};
type Props = {
  selectedHash: string;
  propsDiffBlocks: PropsDiffBlock[];
  onCheck: (m: PropsConflictMap) => void;
};

const Style = css`
  height: 100%;
  overflow: auto;
  padding: 32px;
  border-right: 1px solid #eee;
`;

function diffToTreeNode(block: PropsDiffBlock): Array<TreeDataType> {
  switch (block.kind) {
    case 'conflict':
      return [
        {
          title: `${block.key}: ${JSON.stringify(block.aValue)} >>>>>>>> A`,
          checkable: true,
          key: `${block.path}-a`,
          style: { color: 'green' },
        },
        {
          title: `${block.key}: ${JSON.stringify(block.bValue)} >>>>>>>> B`,
          checkable: true,
          key: `${block.path}-b`,
          style: { color: 'green' },
        },
      ];
    case 'equal':
      return [
        {
          title: block.key,
          children: flatten(block.children.map(diffToTreeNode)),
          key: block.path,
        },
      ];
    case 'change':
      return [
        {
          title: block.key,
          children: flatten(block.children.map(diffToTreeNode)),
          key: block.path,
          style: { color: block.childrenHasConflict ? 'orange' : undefined },
        },
      ];
  }
  return [];
}

export const PropertyViewer: React.FC<Props> = ({
  selectedHash,
  propsDiffBlocks: diffs,
  onCheck,
}) => {
  const data = flatten(diffs.map(diffToTreeNode));

  const _onCheck = (keys: string[]) => {
    const checkedPropsMap: PropsConflictMap = {};
    keys.forEach(key => {
      const rawKey = key.slice(0, -2);
      if (key.endsWith('-a')) {
        checkedPropsMap[rawKey] = 'a';
      } else if (key.endsWith('-b')) {
        checkedPropsMap[rawKey] = 'b';
      }
    });
    onCheck(checkedPropsMap);
  };

  return (
    <div className={Style}>
      <h1>参数编辑器</h1>
      <div>当前选择的Component: {selectedHash}</div>
      <ArcoTree treeData={data} onCheck={_onCheck} />
    </div>
  );
};
