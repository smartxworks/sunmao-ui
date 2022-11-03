import React, { useMemo, useRef, useState } from 'react';
import { SchemaTree } from './components/SchemaTree';
import { HashDivider, mergeApplication } from './mergeApplication';
import { ChangeDiffBlock } from './type';
import { BaseSchema, Schema1, Schema2 } from './mock/changeProperty';
import { Button, Radio } from '@arco-design/web-react';
import { PropertyViewer } from './components/PropertyEditor';
import { solveApplication, solveJson } from './solve';
import { Application, ComponentSchema } from '@sunmao-ui/core';
import { css } from '@emotion/css';
import jsyaml from 'js-yaml';
import { FileUploadArea } from './components/FileUploadArea';
import '@arco-design/web-react/dist/css/arco.css';

const ViewerStyle = css`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const ResultAreaStyle = css`
  flex: 1 1 auto;
  height: 100%;
  overflow: auto;
  padding: 32px;
`;
export const Viewer: React.FC = () => {
  const [appO, setAppO] = useState(BaseSchema);
  const [appA, setAppA] = useState(Schema1);
  const [appB, setAppB] = useState(Schema2);

  const solvedComponentsIdMap = useRef<Record<string, ComponentSchema>>({});
  const [mergedText, setMergedText] = useState<string>('');
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [checkedHashes, setCheckedHashes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'JSON' | 'YAML'>('JSON');

  const { diffBlocks, map, appSkeleton } = useMemo(
    () => mergeApplication(appO, appA, appB),
    [appA, appB, appO]
  );
  const changeRegion: ChangeDiffBlock = diffBlocks.find(
    block => block.kind === 'change' && block.hashA === selectedHash
  ) as ChangeDiffBlock;

  const onClickSolve = () => {
    const newApp = solveApplication({
      diffBlocks: diffBlocks,
      hashMap: map,
      solvedComponentsIdMap: solvedComponentsIdMap.current,
      checkedHashes,
      appSkeleton,
    });
    switch (exportFormat) {
      case 'JSON':
        setMergedText(JSON.stringify(newApp, null, 2));
        break;
      case 'YAML':
        setMergedText(jsyaml.dump(newApp));
        break;
    }
  };

  const onClickCopy = () => {
    navigator.clipboard.writeText(mergedText);
    setCopied(true);
  };

  const onSolveComponent = (component: Record<string, any>) => {
    const id = selectedHash.split(HashDivider)[0];
    solvedComponentsIdMap.current[id] = component as ComponentSchema;
  };

  const onClickMerge = (o: Application, a: Application, b: Application) => {
    setAppO(o);
    setAppA(a);
    setAppB(b);
  };

  return (
    <div className={ViewerStyle}>
      <FileUploadArea onClickMerge={onClickMerge} />
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
          propsDiffBlocks={changeRegion.diffBlocks}
          onCheck={map => {
            const component = solveJson(changeRegion.diffBlocks, map);
            onSolveComponent(component);
          }}
        />
      ) : undefined}
      <div className={ResultAreaStyle}>
        <h1>冲突解决结果</h1>
        <Radio.Group
          defaultValue="JSON"
          value={exportFormat}
          onChange={val => setExportFormat(val)}
        >
          <Radio value="JSON">JSON</Radio>
          <Radio value="YAML">YAML</Radio>
        </Radio.Group>
        <Button onClick={onClickSolve}>Solve</Button>
        <Button disabled={!mergedText} onClick={onClickCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <pre>{mergedText}</pre>
      </div>
    </div>
  );
};
