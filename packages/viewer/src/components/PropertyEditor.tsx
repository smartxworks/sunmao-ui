import React, { useState } from 'react';
import { css } from '@emotion/css';
import { flatten } from 'lodash';
import { Tree as ArcoTree, TreeNodeProps } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { PropsBlock } from '../merge';

export type TreeDataType = TreeNodeProps & {
  key?: string;
  _index?: number;
  children?: TreeDataType[];
  [key: string]: any;
};
type Props = {
  diffs: PropsBlock[];
  onCheck: (m: Record<string, 'a' | 'b'>) => void;
};

const TreeStyle = css`
  height: 100vh;
  overflow: auto;
`;

function diffToTreeNode(block: PropsBlock): Array<TreeDataType> {
  if (block.kind === 'conflict') {
    return [
      {
        title: `${block.key}: ${JSON.stringify(block.aValue)} <<<<<< A`,
        checkable: true,
        key: `${block.path}-a`,
        style: { color: 'green' },
      },
      {
        title: `${block.key}: ${JSON.stringify(block.bValue)} <<<<<< B`,
        checkable: true,
        key: `${block.path}-b`,
        style: { color: 'green' },
      },
    ];
  }

  if (block.kind === 'ok') {
    if (typeof block.value === 'object') {
      return [
        {
          title: block.key,
          children: flatten(block.children.map(diffToTreeNode)),
          key: block.path,
          style: { color: block.hasChange ? 'orange' : undefined },
        },
      ];
    }
    return [
      {
        title: `${block.key}: ${block.value}`,
        key: block.path,
      },
    ];
  }
  return [];
}

export const PropertyViewer: React.FC<Props> = ({ diffs, onCheck }) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const data = flatten(diffs.map(diffToTreeNode));
  console.log('checkedKeys', checkedKeys);
  console.log('diffs', diffs);
  console.log('data', data);

  const _onCheck = (keys: string[]) => {
    setCheckedKeys(keys);
    const checkedPropsMap: Record<string, 'a' | 'b'> = {};
    keys.forEach(key => {
      const rawKey = key.slice(0, -2);
      if (key.endsWith('-a')) {
        checkedPropsMap[rawKey] = 'a';
      } else if (key.endsWith('-b')) {
        checkedPropsMap[rawKey] = 'b';
      }
    });
    console.log('value', checkedPropsMap);
    onCheck(checkedPropsMap);
  };

  return (
    <div className={TreeStyle}>
      <h1>参数编辑器</h1>
      <ArcoTree treeData={data} onCheck={_onCheck} />
    </div>
  );
};
