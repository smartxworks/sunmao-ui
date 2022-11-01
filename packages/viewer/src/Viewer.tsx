import React, { useRef, useState } from 'react';
import { SchemaTree } from './components/SchemaTree';
import { HashDivider, mergeApplication } from './mergeApplication';
import { ChangeDiffBlock } from './type';
import { BaseSchema, Schema1, Schema2 } from './mock/changeProperty';
import { Button } from '@arco-design/web-react';
import { PropertyViewer } from './components/PropertyEditor';
import { restoreApplication, restoreJson } from './restore';
import { ComponentSchema } from '@sunmao-ui/core';
import { css } from '@emotion/css';

const ViewerStyle = css`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const ResultAreaStyle = css`
  height: 100%;
  overflow: auto;
  padding: 32px;
`;
export const Viewer: React.FC = () => {
  const { diffBlocks, map, appSkeleton } = mergeApplication(BaseSchema, Schema1, Schema2);
  console.log('diffBlocks', diffBlocks);
  console.log('map', map);
  const solvedComponentsIdMap = useRef<Record<string, ComponentSchema>>({});
  const [mergedText, setMergedText] = useState<string>('');
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [checkedHashes, setCheckedHashes] = useState<string[]>([]);
  const changeRegion: ChangeDiffBlock = diffBlocks.find(
    block => block.kind === 'change' && block.hashA === selectedHash
  ) as ChangeDiffBlock;

  const onClickMerge = () => {
    const newApp = restoreApplication({
      diffBlocks: diffBlocks,
      hashMap: map,
      solvedComponentsIdMap: solvedComponentsIdMap.current,
      checkedHashes,
      appSkeleton,
    });
    setMergedText(JSON.stringify(newApp, null, 2));
  };

  const onSolveComponent = (component: Record<string, any>) => {
    const id = selectedHash.split(HashDivider)[0];
    solvedComponentsIdMap.current[id] = component as ComponentSchema;
  };

  return (
    <div className={ViewerStyle}>
      <SchemaTree
        diffs={diffBlocks}
        onSelectNode={hash => {
          setSelectedHash(hash);
        }}
        onCheck={value => {
          setCheckedHashes(value);
        }}
      />
      {changeRegion ? (
        <PropertyViewer
          key={selectedHash}
          selectedHash={selectedHash}
          propsDiffBlocks={changeRegion.merged}
          onCheck={map => {
            const component = restoreJson(changeRegion.merged, map);
            console.log('changeRegion.merged', changeRegion.merged);
            console.log('map', map);
            console.log('newjson', component);
            onSolveComponent(component);
          }}
        />
      ) : undefined}
      <div className={ResultAreaStyle}>
        <h1>合并结果</h1>
        <Button onClick={onClickMerge}>合并</Button>
        <pre>{mergedText}</pre>
      </div>
    </div>
  );
};
