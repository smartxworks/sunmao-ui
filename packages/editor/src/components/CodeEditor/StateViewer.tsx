import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { JSONTree } from 'react-json-tree';
import { watch } from '@sunmao-ui/runtime';
import ErrorBoundary from '../ErrorBoundary';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

export const StateViewer: React.FC<{ store: Record<string, unknown> }> = ({ store }) => {
  const [data, setData] = useState(store);
  useEffect(() => {
    watch(store, newValue => {
      setData(JSON.parse(JSON.stringify(newValue)));
    });
  }, [store]);

  const style = css`
    ul {
      padding-left: 0.25em !important;
      height: 100%;
      margin: 0 !important;
    }
  `;
  return (
    <ErrorBoundary>
      <Box height="100%" className={style}>
        <JSONTree data={data} theme={theme} hideRoot />
      </Box>
    </ErrorBoundary>
  );
};
