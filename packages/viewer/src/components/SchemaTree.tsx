import React, { useState } from 'react';
import * as Diff3 from 'node-diff3';
import { css } from '@emotion/css';
import { Tree as ArcoTree, TreeNodeProps, Button } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

type Props = {
  diffs: Diff3.MergeRegion<string>[];
  map: Record<string, any>;
};

const TreeStyle = css`
  height: 100vh;
  overflow: auto;
`;

function diffToTreeNode(
  item: string,
  version = '',
  checkable = false
): TreeNodeProps & { key: string } {
  return {
    title: item + (version ? `  >>>>>>>> ${version}` : ''),
    key: item,
    checkable,
    style: { color: checkable ? 'green' : undefined },
  };
}

export const SchemaTree: React.FC<Props> = ({ diffs, map }) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [mergedText, setMergedText] = useState('');
  const treeData = diffs.reduce((res, diff) => {
    if (diff.ok) {
      return res.concat(diff.ok.map(item => diffToTreeNode(item)));
    }
    if (diff.conflict) {
      return res
        .concat(diff.conflict.a.map(item => diffToTreeNode(item, 'a', true)))
        .concat(diff.conflict.b.map(item => diffToTreeNode(item, 'b', true)));
    }
    return res;
  }, [] as TreeNodeProps[]);

  const onClickMerge = () => {
    const components = diffs.reduce((res, diff) => {
      if (diff.ok) {
        return res.concat(diff.ok.map(item => map[item]));
      }
      if (diff.conflict) {
        console.log('checkedKeys', checkedKeys);
        const selectedKeys = diff.conflict.a
          .concat(diff.conflict.b)
          .filter(item => checkedKeys.includes(item));
        return res.concat(selectedKeys.map(item => map[item]));
      }
      return res;
    }, [] as any[]);
    setMergedText(JSON.stringify(components, null, 2));
  };

  return (
    <div className={TreeStyle}>
      <h1>冲突树</h1>
      <ArcoTree
        treeData={treeData}
        onCheck={value => {
          setCheckedKeys(value);
        }}
      />
      <Button onClick={onClickMerge}>合并</Button>
      <pre>{mergedText}</pre>
    </div>
  );
};
