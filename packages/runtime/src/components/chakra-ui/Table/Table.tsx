import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sortBy } from 'lodash';
import { Table as BaseTable, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { ComponentImplementation } from '../../../registry';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TablePagination } from './Pagination';

function normalizeData(data: Static<typeof DataPropertySchema>): {
  normalizedData: Array<Record<string, string>>;
  keys: string[];
} {
  const normalizedData: Array<Record<string, string>> = [];
  const keys = new Set<string>();
  for (const item of data) {
    if (typeof data !== 'object') {
      normalizedData.push({});
    } else {
      normalizedData.push(item);
      Object.keys(item).forEach(key => keys.add(key));
    }
  }
  return {
    normalizedData,
    keys: Array.from(keys),
  };
}

type SortRule = {
  key: string;
  desc: boolean;
};

const Table: ComponentImplementation<{
  data?: Static<typeof DataPropertySchema>;
  majorKey: Static<typeof MajorKeyPropertySchema>;
  rowsPerPage: Static<typeof RowsPerPagePropertySchema>;
  size: Static<typeof SizePropertySchema>;
  columns: Static<typeof ColumnsPropertySchema>;
}> = ({ data, majorKey, rowsPerPage, size, columns, mergeState }) => {
  if (!data) {
    return <div>loading</div>;
  }

  const { normalizedData } = normalizeData(data);
  const [selectedItem, setSelectedItem] = useState<Record<string, string>>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortRule, setSortRule] = useState<SortRule | undefined>();
  const pageNumber = Math.ceil(data.length / rowsPerPage);

  const sortedData = useMemo(() => {
    if (!sortRule) return normalizedData;
    const sorted = sortBy(normalizedData, sortRule.key);
    return sortRule.desc ? sorted.reverse() : sorted;
  }, [sortRule, normalizedData]);

  const currentPageData = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const onClickRow = useCallback(
    item => {
      setSelectedItem(item);
      mergeState({ selectedItem: item });
    },
    [setSelectedItem]
  );

  return (
    <div>
      <BaseTable size={size}>
        <Thead>
          <Tr>
            {columns.map(({ title, key }) => {
              let sortArrow;
              if (sortRule && sortRule.key === key) {
                sortArrow = sortRule.desc ? '⬇️' : '⬆️';
              }

              const onClick = () => {
                if (sortRule && sortRule.key === key) {
                  setSortRule({ key, desc: !sortRule.desc });
                } else {
                  setSortRule({ key, desc: true });
                }
              };
              return (
                <Th key={key} onClick={onClick}>
                  {title}
                  {sortArrow}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {currentPageData.map(item => {
            const isSelected =
              selectedItem && item[majorKey] === selectedItem[majorKey];
            return (
              <Tr
                key={item[majorKey]}
                bgColor={isSelected ? 'gray' : undefined}
                onClick={() => onClickRow(item)}>
                {columns.map(({ key }) => (
                  <Td key={key}>{item[key] ?? '-'}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </BaseTable>
      <TablePagination
        pageNumber={pageNumber}
        currentPage={currentPage}
        onChange={v => setCurrentPage(v)}
      />
    </div>
  );
};

const MajorKeyPropertySchema = Type.String();
const RowsPerPagePropertySchema = Type.Number();
const DataPropertySchema = Type.Array(Type.Any());
const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);
const ColumnsPropertySchema = Type.Array(
  Type.Object({
    key: Type.String(),
    title: Type.String(),
    // displayValue: Type.String(),
    // type: Type.String(),// text,image,button...
  })
);

const StateSchema = Type.Object({});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'table',
      description: 'chakra-ui table',
    },
    spec: {
      properties: [
        {
          name: 'data',
          ...DataPropertySchema,
        },
        {
          name: 'marjorKey',
          ...MajorKeyPropertySchema,
        },
        {
          name: 'rowsPerPage',
          ...RowsPerPagePropertySchema,
        },
        {
          name: 'size',
          ...SizePropertySchema,
        },
        {
          name: 'columns',
          ...ColumnsPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Table,
};
