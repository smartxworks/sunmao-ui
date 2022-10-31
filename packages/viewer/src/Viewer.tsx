import React, { useState } from 'react';
import { SchemaTree } from './components/SchemaTree';
import { ChangeDiffBlock, merge, mergeJSON } from './merge';
import { BaseSchema, Schema1, Schema2 } from './mock/changeProperty';
import { Space } from '@arco-design/web-react';
import { PropertyViewer } from './components/PropertyEditor';
import { restoreJson } from './restoreJson';

export const Viewer: React.FC = () => {
  const { mergeRegion, map } = merge(BaseSchema, Schema1, Schema2);
  console.log('mergeRegion', mergeRegion);
  console.log('map', map);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const changeRegion: ChangeDiffBlock = mergeRegion.find(
    block => block.kind === 'change' && block.hashA === selectedKey
  ) as ChangeDiffBlock;

  const merged = changeRegion
    ? mergeJSON(changeRegion.o, changeRegion.a, changeRegion.b)
    : [];

  return (
    <Space>
      <SchemaTree
        diffs={mergeRegion}
        map={map}
        onSelectNode={hash => {
          setSelectedKey(hash);
        }}
      />
      <div>Component Props</div>
      {selectedKey}
      <PropertyViewer
        diffs={merged}
        onCheck={map => {
          console.log('newjson', restoreJson(merged, map));
        }}
      />
    </Space>
  );
};
