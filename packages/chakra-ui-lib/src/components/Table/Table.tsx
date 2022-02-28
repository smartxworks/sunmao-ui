import React, { useEffect, useMemo, useState } from 'react';
import { isArray, sortBy } from 'lodash-es';
import {
  Table as BaseTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Checkbox,
  Td,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { TablePagination } from './Pagination';

import { TableTd } from './TableTd';
import { implementTable } from './spec';
import { ColumnsPropertySchema } from './TableTypes';
import { Static } from '@sinclair/typebox';

type SortRule = {
  key: string;
  desc: boolean;
};

export const TableImpl = implementTable(
  ({
    component,
    data,
    majorKey,
    rowsPerPage,
    size,
    columns,
    isMultiSelect,
    mergeState,
    services,
    app,
    elementRef,
  }) => {
    const [selectedItem, setSelectedItem] = useState<Record<string, any> | undefined>();
    const [selectedItems, setSelectedItems] = useState<Array<Record<string, any>>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortRule, setSortRule] = useState<SortRule | undefined>();
    const pageNumber = Math.ceil((data?.length || 0) / rowsPerPage);

    useEffect(() => {
      mergeState({ selectedItems });
    }, [mergeState, selectedItems]);

    useEffect(() => {
      mergeState({ selectedItem });
    }, [mergeState, selectedItem]);

    useEffect(() => {
      // reset table state when data source changes
      if (selectedItems.length > 0) {
        setSelectedItems([]);
      }

      if (!selectedItem) {
        setSelectedItem(undefined);
      }
      setCurrentPage(0);
      setSortRule(undefined);
    }, [data, selectedItem, selectedItems.length, setSelectedItem, setSelectedItems]);

    const sortedData = useMemo(() => {
      if (!isArray(data)) return [];
      if (!sortRule) return data;
      const sorted = sortBy(data, sortRule.key);
      return sortRule.desc ? sorted.reverse() : sorted;
    }, [sortRule, data]);

    const currentPageData = sortedData?.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage
    );

    function isItemSelected(target: any) {
      if (isMultiSelect) {
        return selectedItems.findIndex(item => item[majorKey] === target[majorKey]) > -1;
      }
      return selectedItem && selectedItem[majorKey] === target[majorKey];
    }

    function selectItem(item: any) {
      if (isMultiSelect) {
        let newSelectedItems;
        if (isItemSelected(item)) {
          newSelectedItems = selectedItems.filter(
            selectedItem => selectedItem[majorKey] !== item[majorKey]
          );
        } else {
          newSelectedItems = selectedItems.concat(item);
        }
        setSelectedItems(newSelectedItems);
      }
      setSelectedItem(item);
    }

    const allCheckbox = useMemo(() => {
      if (!data) return null;
      const isAllChecked = isMultiSelect && selectedItems.length === data.length;
      const isIndeterminate =
        selectedItems.length > 0 && selectedItems.length < data.length;
      const onChange = (e: any) => {
        if (e.target.checked) {
          setSelectedItems(data);
        } else {
          setSelectedItems([]);
        }
      };
      return (
        <Th paddingX="4" paddingY="2" width="10" key="allCheckbox">
          <Checkbox
            size="lg"
            isIndeterminate={isIndeterminate}
            checked={isAllChecked}
            onChange={onChange}
          />
        </Th>
      );
    }, [data, isMultiSelect, selectedItems.length, setSelectedItems]);

    const tableContent = (
      <>
        <BaseTable size={size || 'md'}>
          <Thead>
            <Tr height="10">
              {isMultiSelect ? allCheckbox : undefined}
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
                  <Th paddingX="4" paddingY="2" key={key} onClick={onClick}>
                    {title}
                    {sortArrow}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {currentPageData?.map((item, i) => {
              const isSelected = isItemSelected(item);
              let onClickToggle = true;
              const onClickCheckbox = (e: React.MouseEvent<HTMLElement>) => {
                // chakra-ui checkbox has a bug which will trigger onClick twice
                // so here I stopPropagation one of every two events
                // https://github.com/chakra-ui/chakra-ui/issues/2854
                if (onClickToggle) {
                  e.stopPropagation();
                }
                onClickToggle = !onClickToggle;
              };
              const checkbox = (
                <Td
                  paddingX="4"
                  paddingY="2"
                  width="10"
                  key="$checkbox"
                  onClick={onClickCheckbox}
                >
                  <Checkbox size="lg" isChecked={isSelected} />
                </Td>
              );

              return (
                <Tr
                  key={item[majorKey]}
                  height="10"
                  bgColor={isSelected ? 'yellow.100' : undefined}
                  onClick={() => {
                    selectItem(item);
                  }}
                >
                  {isMultiSelect ? checkbox : undefined}
                  {columns.map((column, j) => (
                    <TableTd
                      index={i}
                      key={column.key}
                      item={item}
                      onClickItem={() => selectItem(item)}
                      rawColumn={(component.properties.columns as Static<typeof ColumnsPropertySchema>)[j]}
                      column={column}
                      services={services}
                      app={app}
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
      </>
    );

    const loadingSpinner = (
      <Box display="flex" height="full">
        <Spinner size="xl" margin="auto" />
      </Box>
    );

    return (
      <Box
        width="full"
        height="full"
        background="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="base"
        overflow="auto"
        ref={elementRef}
      >
        {!data ? loadingSpinner : tableContent}
      </Box>
    );
  }
);
