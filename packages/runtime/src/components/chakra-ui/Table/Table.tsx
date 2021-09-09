import React, { useCallback, useMemo, useState } from 'react';
import { sortBy } from 'lodash';
import { Table as BaseTable, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { TablePagination } from './Pagination';
import { ComponentImplementation } from '../../../registry';
import {
  ColumnsPropertySchema,
  DataPropertySchema,
  MajorKeyPropertySchema,
  RowsPerPagePropertySchema,
  TableSizePropertySchema,
} from './TableTypes';
import { TableTd } from './Td';

type SortRule = {
  key: string;
  desc: boolean;
};

export const TableImpl: ComponentImplementation<{
  data?: Static<typeof DataPropertySchema>;
  majorKey: Static<typeof MajorKeyPropertySchema>;
  rowsPerPage: Static<typeof RowsPerPagePropertySchema>;
  size: Static<typeof TableSizePropertySchema>;
  columns: Static<typeof ColumnsPropertySchema>;
}> = ({ data, majorKey, rowsPerPage, size, columns, mergeState }) => {
  if (!data) {
    return <div>loading</div>;
  }

  const normalizedData = data;
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

  const onClickItem = useCallback(
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
                onClick={() => onClickItem(item)}>
                {columns.map(column => (
                  <TableTd
                    key={column.key}
                    item={item}
                    column={column}
                    onClickItem={() => onClickItem(item)}
                  />
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
