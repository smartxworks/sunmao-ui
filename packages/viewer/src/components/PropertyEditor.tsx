// import React, { useState } from 'react';
// import * as Diff3 from 'node-diff3';
// import { css } from '@emotion/css';
// import { Tree as ArcoTree, TreeNodeProps } from '@arco-design/web-react';
// import '@arco-design/web-react/dist/css/arco.css';

// type Props = {
//   diffs: Diff3.MergeRegion<string>[];
//   map: Record<string, any>;
// };

// const TreeStyle = css`
//   height: 100vh;
//   overflow: auto;
// `;

// function diffToTreeNode(
//   item: string,
//   version = '',
//   checkable = false
// ): TreeNodeProps & { key: string } {
//   return {
//     title: item + (version ? `  >>>>>>>> ${version}` : ''),
//     key: item,
//     checkable,
//     style: { color: checkable ? 'green' : undefined },
//   };
// }

// export const SchemaTree: React.FC<Props> = ({ diffs, map }) => {
//   const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
//   const [mergedText, setMergedText] = useState('');
//   const treeData = diffs.reduce((res, diff) => {
//     if (diff.ok) {
//       return res.concat(diff.ok.map(item => diffToTreeNode(item)));
//     }
//     if (diff.conflict) {
//       return res
//         .concat(diff.conflict.a.map(item => diffToTreeNode(item, 'a', true)))
//         .concat(diff.conflict.b.map(item => diffToTreeNode(item, 'b', true)));
//     }
//     return res;
//   }, [] as TreeNodeProps[]);

//   return (
//     <div className={TreeStyle}>
//       <h1>参数编辑器</h1>
//       <ArcoTree
//         treeData={treeData}
//         onCheck={value => {
//           setCheckedKeys(value);
//         }}
//       />
//     </div>
//   );
// };
