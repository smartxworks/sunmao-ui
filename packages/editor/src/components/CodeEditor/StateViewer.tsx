import React, { useEffect, useMemo, useState } from 'react';
import { Box, Input } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { JSONTree } from 'react-json-tree';
import { pickBy } from 'lodash-es';
import { watch } from '@sunmao-ui/runtime';
import ErrorBoundary from '../ErrorBoundary';

const theme = {
  base0A: '#fded02',
  base0B: '#01a252',
  base0C: '#b5e4f4',
  base0D: '#01a0e4',
  base0E: '#a16a94',
  base0F: '#cdab53',
  base00: '#090300',
  base01: '#3a3432',
  base02: '#4a4543',
  base03: '#5c5855',
  base04: '#807d7c',
  base05: '#a5a2a2',
  base06: '#d6d5d4',
  base07: '#f7f7f7',
  base08: '#db2d20',
  base09: '#e8bbd0',
};

const style = css`
  ul {
    padding-left: 0.25em !important;
    flex: 1;
    margin: 0 !important;
    background-color: white !important;
  }
`;

export const StateViewer: React.FC<{ store: Record<string, unknown> }> = ({ store }) => {
  const [filterText, setFilterText] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(0);
  const data = useMemo(() => {
    return pickBy(store, (_v, key) => {
      return filterText ? key.includes(filterText) : true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, filterText, refreshFlag]);

  useEffect(() => {
    const stop = watch(store, () => {
      setRefreshFlag(v => v + 1);
    });

    return stop;
  }, [store]);

  return (
    <ErrorBoundary>
      <Box height="100%" className={style} display="flex" flexDirection="column">
        <Input
          placeholder="filter the states"
          value={filterText}
          onChange={evt => setFilterText(evt.currentTarget.value)}
        />
        <JSONTree data={data} theme={theme} hideRoot sortObjectKeys />
      </Box>
    </ErrorBoundary>
  );
};
