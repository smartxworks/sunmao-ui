import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { SchemaTree } from './components/SchemaTree';
import { merge } from './merge';
import { BaseSchema, Schema1, Schema2 } from './mock/mock';

export default function renderApp() {
  const { mergeRegion, map } = merge(BaseSchema, Schema1, Schema2);
  console.log('mergeRegion', mergeRegion);
  ReactDOM.render(
    <StrictMode>
      <SchemaTree diffs={mergeRegion} map={map} />
    </StrictMode>,
    document.getElementById('root')
  );
}
