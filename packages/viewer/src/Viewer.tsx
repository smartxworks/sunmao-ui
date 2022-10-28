import React from 'react';
import { SchemaTree } from './components/SchemaTree';
import { merge } from './merge';
import { BaseSchema, Schema1, Schema2 } from './mock/changeProperty';

export const Viewer: React.FC = () => {
  const { mergeRegion, map } = merge(BaseSchema, Schema1, Schema2);
  console.log('mergeRegion', mergeRegion);

  return (
    <div>
      <SchemaTree diffs={mergeRegion} map={map} />
    </div>
  );
};
