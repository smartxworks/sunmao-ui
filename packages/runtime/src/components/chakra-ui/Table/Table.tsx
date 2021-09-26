import { useEffect, useMemo, useState } from 'react';
import { sortBy } from 'lodash';
import {
  Table as BaseTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Checkbox,
  Td,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { TablePagination } from './Pagination';
import { ComponentImplementation } from '../../../registry';
import {
  ColumnsPropertySchema,
  DataPropertySchema,
  IsMultiSelectPropertySchema,
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
  isMultiSelect: Static<typeof IsMultiSelectPropertySchema>;
}> = ({
  data,
  majorKey,
  rowsPerPage,
  size,
  columns,
  isMultiSelect,
  mergeState,
  stateManager,
}) => {
  if (!data) {
    return <div>loading</div>;
  }
  const normalizedData = data;
  const [selectedItem, setSelectedItem] = useState<
    Record<string, any> | undefined
  >();
  const [selectedItems, setSelectedItems] = useState<
    Array<Record<string, any>>
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortRule, setSortRule] = useState<SortRule | undefined>();
  const pageNumber = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    // reset table state when data source changes
    updateSelectedItems([]);
    updateSelectedItem(undefined);
    setCurrentPage(0);
    setSortRule(undefined);
  }, [normalizedData]);

  const updateSelectedItems = (items: Array<Record<string, any>>) => {
    setSelectedItems(items);
    mergeState({ selectedItems: items });
  };

  const updateSelectedItem = (item?: Record<string, any>) => {
    setSelectedItem(item);
    mergeState({ selectedItem: item });
  };

  const sortedData = useMemo(() => {
    if (!sortRule) return normalizedData;
    const sorted = sortBy(normalizedData, sortRule.key);
    return sortRule.desc ? sorted.reverse() : sorted;
  }, [sortRule, normalizedData]);

  const currentPageData = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  function isItemSelected(target: any) {
    if (isMultiSelect) {
      return (
        selectedItems.findIndex(item => item[majorKey] === target[majorKey]) >
        -1
      );
    }
    return selectedItem && selectedItem[majorKey] === target[majorKey];
  }

  function selectItem(item: any) {
    if (isMultiSelect) {
      let newSelectedItems;
      if (isItemSelected(item)) {
        newSelectedItems = selectedItems.filter(
          selectedItem => selectedItem[majorKey] != item[majorKey]
        );
      } else {
        newSelectedItems = selectedItems.concat(item);
      }
      updateSelectedItems(newSelectedItems);
    }
    updateSelectedItem(item);
  }

  const allCheckbox = useMemo(() => {
    const isAllChecked =
      isMultiSelect && selectedItems.length === normalizedData.length;
    const isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < normalizedData.length;
    const onChange = (e: any) => {
      if (e.target.checked) {
        updateSelectedItems(normalizedData);
      } else {
        updateSelectedItems([]);
      }
    };
    return (
      <Th key="allCheckbox">
        <Checkbox
          size="lg"
          isIndeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={onChange}
        ></Checkbox>
      </Th>
    );
  }, [selectedItems.length, normalizedData.length]);

  return (
    <div>
      <BaseTable size={size}>
        <Thead>
          <Tr>
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
              <Td key="$checkbox" onClick={onClickCheckbox}>
                <Checkbox size="lg" isChecked={isSelected}></Checkbox>
              </Td>
            );

            return (
              <Tr
                key={item[majorKey]}
                bgColor={isSelected ? 'gray' : undefined}
                onClick={() => {
                  selectItem(item);
                }}
              >
                {isMultiSelect ? checkbox : undefined}
                {columns.map(column => (
                  <TableTd
                    key={column.key}
                    item={item}
                    column={column}
                    onClickItem={() => selectItem(item)}
                    stateManager={stateManager}
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
