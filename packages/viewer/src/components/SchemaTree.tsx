import React from 'react';
import { css } from '@emotion/css';
import { Tree as ArcoTree, TreeNodeProps } from '@arco-design/web-react';

import { DiffBlock } from '../type';
import '@arco-design/web-react/dist/css/arco.css';

type Props = {
  diffs: DiffBlock[];
  onSelectNode: (hash: string) => void;
  onCheck: (hashes: string[]) => void;
};

const TreeStyle = css`
  height: 100%;
  padding: 32px;
  width: 400px;
  overflow: auto;
  border-right: 1px solid #eee;
`;

function diffToTreeNode(block: DiffBlock): Array<TreeNodeProps & { key: string }> {
  switch (block.kind) {
    case 'ok':
      return block.o.map((component, i) => {
        return {
          title: component.id,
          key: block.hashes[i],
        };
      });
    case 'change':
      return [
        {
          title: block.id,
          key: block.hashA,
          checkable: true,
          style: { color: 'orange' },
        },
      ];
    case 'conflict':
      const aNodes = block.a.map((c, i) => {
        return {
          title: `${c.id}  >>>>>>>> ${block.aHashes[i]}`,
          key: block.aHashes[i],
          checkable: true,
          style: { color: 'green' },
        };
      });
      const bNodes = block.b.map((c, i) => {
        return {
          title: `${c.id}  >>>>>>>> ${block.bHashes[i]}`,
          key: block.bHashes[i],
          checkable: true,
          style: { color: 'green' },
        };
      });
      return aNodes.concat(bNodes);
  }
}

export const SchemaTree: React.FC<Props> = ({ diffs, onSelectNode, onCheck }) => {
  const treeData = diffs.reduce((res, diff) => {
    return res.concat(diffToTreeNode(diff));
  }, [] as TreeNodeProps[]);
  return (
    <div className={TreeStyle}>
      <h1>冲突树</h1>
      <ArcoTree
        treeData={treeData}
        onSelect={hash => {
          onSelectNode(hash[0]);
        }}
        onCheck={value => {
          onCheck(value);
        }}
      />
    </div>
  );
};
