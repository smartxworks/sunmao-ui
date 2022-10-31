import React from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { css } from '@emotion/css';
import { Tree as ArcoTree, TreeNodeProps, Button } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { DiffBlock } from '../merge';

type Props = {
  diffs: DiffBlock[];
  map: Record<string, ComponentSchema<unknown>>;
  onSelectNode: (hash: string) => void;
};

const TreeStyle = css`
  height: 100vh;
  overflow: auto;
`;

function diffToTreeNode(
  block: DiffBlock,
  checkable = false
): Array<TreeNodeProps & { key: string }> {
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
          checkable,
          style: { color: 'green' },
        };
      });
      const bNodes = block.b.map((c, i) => {
        return {
          title: `${c.id}  >>>>>>>> ${block.bHashes[i]}`,
          key: block.bHashes[i],
          checkable,
          style: { color: 'green' },
        };
      });
      return aNodes.concat(bNodes);
  }
}

export const SchemaTree: React.FC<Props> = ({ diffs, onSelectNode }) => {
  // const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  // const [mergedText, setMergedText] = useState('');
  const treeData = diffs.reduce((res, diff) => {
    return res.concat(diffToTreeNode(diff));
  }, [] as TreeNodeProps[]);
  console.log('treeData', treeData);
  const onClickMerge = () => {
    // const components = diffs.reduce((res, diff) => {
    //   if (diff.ok) {
    //     return res.concat(diff.ok.map(item => map[item]));
    //   }
    //   if (diff.conflict) {
    //     console.log('checkedKeys', checkedKeys);
    //     const selectedKeys = diff.conflict.a
    //       .concat(diff.conflict.b)
    //       .filter(item => checkedKeys.includes(item));
    //     return res.concat(selectedKeys.map(item => map[item]));
    //   }
    //   return res;
    // }, [] as any[]);
    // setMergedText(JSON.stringify(components, null, 2));
  };

  return (
    <div className={TreeStyle}>
      <h1>冲突树</h1>
      <ArcoTree
        treeData={treeData}
        onSelect={hash => {
          onSelectNode(hash[0]);
        }}
        // onCheck={value => {
        //   setCheckedKeys(value);
        // }}
      />
      <Button onClick={onClickMerge}>合并</Button>
      {/* <pre>{mergedText}</pre> */}
    </div>
  );
};
