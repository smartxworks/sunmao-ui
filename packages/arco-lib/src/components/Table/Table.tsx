/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { sortBy } from 'lodash';
import { ResizeCallbackData } from 'react-resizable';
import { TableInstance } from '@arco-design/web-react/es/Table/table';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';
import {
  Button,
  Link,
  Input,
  Table as BaseTable,
  PaginationProps,
} from '@arco-design/web-react';
import {
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleRenderer,
  implementRuntimeComponent,
  ImplWrapper,
  formatSlotKey,
} from '@sunmao-ui/runtime';
import { Type, Static } from '@sinclair/typebox';
import { ResizableTitle } from './ResizableTitle';

import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { TablePropsSpec, ColumnSpec } from '../../generated/types/Table';
import { useStateValue } from '../../hooks/useStateValue';

const TableStateSpec = Type.Object({
  clickedRow: Type.Optional(Type.Any()),
  selectedRows: Type.Array(Type.Any()),
  selectedRowKeys: Type.Array(Type.String()),
  filterRule: Type.Record(Type.String(), Type.Array(Type.String())),
  sortRule: Type.Object({
    field: Type.Optional(Type.String()),
    direction: Type.Optional(Type.String()),
  }),
  currentPage: Type.Number(),
  pageSize: Type.Number(),
});

type SortRule = {
  field?: string;
  direction?: 'ascend' | 'descend';
};

type ColumnProperty = Static<typeof ColumnSpec> & ColumnProps;

type filterDropdownParam = {
  filterKeys?: string[];
  setFilterKeys?: (filterKeys: string[], callback?: Function) => void;
  confirm?: Function;
};

const rowSelectionTypeMap: Record<string, 'checkbox' | 'radio' | undefined> = {
  multiple: 'checkbox',
  single: 'radio',
  disable: undefined,
};

const rowClickStyle = css`
  cursor: pointer;
  & tr.selected td {
    background-color: rgb(235, 244, 251);
  }
  & tr.selected:hover > td {
    background-color: rgb(228, 236, 243) !important;
  }
`;

export const exampleProperties: Static<typeof TablePropsSpec> = {
  columns: [
    {
      title: 'Key',
      dataIndex: 'key',
      type: 'text',
      displayValue: '',
      filter: false,
      componentSlotIndex: 0,
      sorter: false,
      ellipsis: false,
      width: -1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      type: 'text',
      filter: true,
      displayValue: '',
      ellipsis: false,
      componentSlotIndex: 0,
      width: -1,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      filter: false,
      type: 'text',
      displayValue: '',
      ellipsis: false,
      componentSlotIndex: 0,
      width: -1,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      type: 'link',
      filter: true,
      sorter: false,
      sortDirections: ['ascend', 'descend'],
      displayValue: '',
      ellipsis: false,
      componentSlotIndex: 0,
      width: -1,
    },
  ],
  data: Array(13)
    .fill('')
    .map((_, index) => ({
      key: index,
      name: `${Math.random() > 0.5 ? 'Kevin Sandra' : 'Naomi Cook'}${index}`,
      link: `link${Math.random() > 0.5 ? '-A' : '-B'}`,
      salary: Math.floor(Math.random() * 1000),
    })),
  rowKey: 'key',
  checkCrossPage: true,
  pagination: {
    enablePagination: true,
    pageSize: 6,
    defaultCurrent: 1,
    updateWhenDefaultPageChanges: false,
    useCustomPagination: false,
    simple: false,
    showJumper: false,
    showTotal: false,
  },
  rowClick: false,
  tableLayoutFixed: false,
  borderCell: false,
  stripe: false,
  size: 'default',
  useDefaultFilter: true,
  useDefaultSort: true,
  pagePosition: 'bottomCenter',
  rowSelectionType: 'single',
  border: true,
  loading: false,
};

export const Table = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
    name: 'table',
    displayName: 'Table',
  },
  spec: {
    properties: TablePropsSpec,
    state: TableStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({
          [LIST_ITEM_EXP]: Type.Any(),
          [LIST_ITEM_INDEX_EXP]: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: ['onRowClick', 'onSearch', 'onPageChange', 'onFilter', 'onSort', 'onChange'],
  },
})(props => {
  const {
    getElement,
    checkCrossPage,
    callbackMap,
    app,
    allComponents,
    mergeState,
    customStyle,
    services,
    component,
    slotsElements,
  } = props;

  const ref = useRef<TableInstance | null>(null);
  const {
    pagination,
    rowKey,
    rowClick,
    useDefaultFilter,
    useDefaultSort,
    data,
    ...cProps
  } = getComponentProps(props);

  const {
    pageSize,
    updateWhenDefaultPageChanges,
    enablePagination,
    total,
    defaultCurrent,
    useCustomPagination,
    ...restPaginationProps
  } = pagination;

  const rowSelectionType = rowSelectionTypeMap[cProps.rowSelectionType];
  const currentChecked = useRef<(string | number)[]>([]);
  const currentClickedRow = useRef<(string | number)[] | undefined>(undefined);

  const [currentPage, setCurrentPage] = useStateValue<number>(
    !defaultCurrent || defaultCurrent < 1 ? 1 : defaultCurrent,
    mergeState,
    updateWhenDefaultPageChanges,
    'currentPage'
  );

  useEffect(() => {
    mergeState({ pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sortRule, setSortRule] = useState<SortRule | null>(null);

  const [columns, setColumns] = useState<ColumnProperty[]>([]);
  const inputRef = useRef<RefInputType | null>(null);

  const handleResize = (
    columnIdx: number
  ): ((e: React.SyntheticEvent, data: ResizeCallbackData) => void) => {
    return (_e, data) => {
      const { size } = data;
      setColumns(prevColumns => {
        const nextColumns = [...prevColumns];
        nextColumns[columnIdx] = {
          ...nextColumns[columnIdx],
          width: size.width,
        };

        return nextColumns;
      });
    };
  };

  const sortedData = useMemo(() => {
    const sortedData = Array.isArray(data) ? data : [];
    if (!sortRule || !sortRule.direction) {
      return sortedData;
    }

    const sorted = sortBy(sortedData, sortRule.field!);
    return sortRule.direction === 'ascend' ? sorted : sorted.reverse();
  }, [data, sortRule]);

  const currentPageData = useMemo(() => {
    if (enablePagination && useCustomPagination) {
      // If the `useCustomPagination` is true, then no pagination will be done and data over the pagesize will be sliced
      // Otherwise it will automatically paginate on the front end based on the current page
      return sortedData?.slice(0, pageSize);
    }

    return sortedData;
  }, [pageSize, sortedData, enablePagination, useCustomPagination]);

  // reset selectedRows state when data changed
  useEffect(() => {
    // under server-side paging and with checkCrossPage enabled, the previous data should be cached without having to update it
    if (useCustomPagination && checkCrossPage) {
      return;
    }
    const selectedRows = currentPageData.filter(d =>
      currentChecked.current.includes(d[rowKey])
    );
    // TODO: Save clickedRow state when rowkey changes, save the UI of clickedRow when turning the page
    const clickedRow = currentPageData.find(d => d[rowKey] === currentClickedRow.current);
    if (!clickedRow) currentClickedRow.current = undefined;
    mergeState({
      selectedRowKeys: selectedRows.map(r => r[rowKey]),
      selectedRows,
      clickedRow,
    });
  }, [checkCrossPage, currentPageData, mergeState, rowKey, useCustomPagination]);

  // If there is less data to display than the current page, reset to the first page
  useEffect(() => {
    if (useCustomPagination) return;
    if (currentPageData.length <= Number(pageSize) * (currentPage - 1)) {
      // TODO: Better interaction experience
      setCurrentPage(1);
    }
  }, [
    currentPage,
    currentPageData.length,
    pageSize,
    setCurrentPage,
    useCustomPagination,
  ]);

  useEffect(() => {
    setColumns(
      cProps.columns!.map((column, i) => {
        const newColumn: ColumnProperty = { ...column };
        if (newColumn.width === -1) {
          Reflect.deleteProperty(newColumn, 'width');
        } else if (newColumn.width) {
          newColumn.onHeaderCell = col => ({
            width: col.width,
            onResize: handleResize(i),
          });
        }

        if (newColumn.filter) {
          newColumn.filterDropdown = ({
            filterKeys,
            setFilterKeys,
            confirm,
          }: filterDropdownParam) => {
            return (
              <div className="arco-table-custom-filter">
                <Input.Search
                  ref={inputRef}
                  searchButton
                  placeholder="Please input and enter"
                  value={filterKeys?.[0] || ''}
                  onChange={value => {
                    setFilterKeys && setFilterKeys(value ? [value] : []);
                  }}
                  onSearch={() => {
                    confirm && confirm();
                    callbackMap?.onSearch?.();
                  }}
                />
              </div>
            );
          };

          newColumn.onFilterDropdownVisibleChange = visible => {
            if (visible) {
              setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
            }
          };

          if (useDefaultFilter) {
            newColumn.onFilter = (value, row) => {
              return value
                ? String(row[newColumn.dataIndex])
                    .toLowerCase()
                    .indexOf(String(value).toLowerCase()) !== -1
                : true;
            };
          }
        }

        newColumn.render = (ceilValue: any, record: any, index: number) => {
          const evalOptions = {
            scopeObject: {
              [LIST_ITEM_EXP]: record,
            },
          };

          const rawColumn = component.properties.columns[i];
          const evaledColumn = services.stateManager.deepEval(
            rawColumn,
            evalOptions
          ) as ColumnProperty;

          const value = record[evaledColumn.dataIndex];

          let colItem;

          switch (evaledColumn.type) {
            case 'button':
              const handleClick = () => {
                const evaledButtonConfig = evaledColumn.btnCfg;

                if (!evaledButtonConfig) return;

                evaledButtonConfig.handlers.forEach(handler => {
                  services.apiService.send('uiMethod', {
                    componentId: handler.componentId,
                    name: handler.method.name,
                    parameters: handler.method.parameters || {},
                    triggerId: component.id,
                    eventType: 'onClick',
                  });
                });
              };
              colItem = (
                <Button
                  onClick={() => {
                    handleClick();
                  }}
                >
                  {evaledColumn.btnCfg?.text}
                </Button>
              );
              break;
            case 'link':
              colItem = <Link href={value}>{evaledColumn.displayValue || value}</Link>;
              break;
            case 'module':
              const evalScope = {
                [LIST_ITEM_EXP]: record,
                [LIST_ITEM_INDEX_EXP]: index,
              };
              colItem = (
                <ModuleRenderer
                  app={app}
                  evalScope={evalScope}
                  handlers={evaledColumn.module?.handlers || []}
                  id={evaledColumn.module?.id || ''}
                  properties={evaledColumn.module?.properties || {}}
                  services={services}
                  type={evaledColumn.module?.type || ''}
                />
              );
              break;

            case 'component':
              const childrenSchema = allComponents.filter(c => {
                return c.traits.find(
                  t =>
                    (t.type === 'core/v1/slot' || t.type === 'core/v2/slot') &&
                    (t.properties.container as any).id === component.id
                );
              });

              const childSchema = childrenSchema[evaledColumn.componentSlotIndex || 0];
              if (!childSchema) {
                return (
                  <div>
                    Cannot find child with index {column.componentSlotIndex} in slot.
                  </div>
                );
              }

              const _childrenSchema = {
                ...childSchema,
                id: `${component.id}_${childSchema.id}_${index}`,
              };

              /**
               * FIXME: temporary hack
               */
              slotsElements.content?.(
                {
                  [LIST_ITEM_EXP]: record,
                  [LIST_ITEM_INDEX_EXP]: index,
                },
                undefined,
                `${childSchema.id}_${index}`
              );

              colItem = (
                <ImplWrapper
                  key={_childrenSchema.id}
                  component={_childrenSchema}
                  app={app}
                  services={services}
                  allComponents={allComponents}
                  childrenMap={{}}
                  isInModule
                  slotContext={{
                    renderSet: new Set(),
                    slotKey: formatSlotKey(
                      component.id,
                      'content',
                      `${childSchema.id}_${index}`
                    ),
                  }}
                />
              );
              break;
            default:
              const text = evaledColumn.displayValue || value;
              colItem = <span title={column.ellipsis ? text : ''}>{text}</span>;
              break;
          }
          return colItem;
        };
        return newColumn;
      })
    );
  }, [
    app,
    cProps.columns,
    callbackMap,
    component.id,
    slotsElements,
    component.properties.columns,
    services,
    useDefaultFilter,
  ]);

  const handleChange = (
    pagination: PaginationProps,
    sorter: { field?: string; direction?: 'descend' | 'ascend' },
    filters: Partial<Record<string, string[]>>,
    extra: { currentData: any[]; action: 'paginate' | 'sort' | 'filter' }
  ) => {
    const { current } = pagination;
    const { action } = extra;

    switch (action) {
      case 'paginate':
        if (useCustomPagination) {
          callbackMap?.onPageChange?.();
        }
        mergeState({ currentPage: current, pageSize });
        setCurrentPage(current!);
        break;
      case 'sort':
        if (useDefaultSort) {
          setSortRule(sorter);
        } else {
          setSortRule(null);
          mergeState({ sortRule: sorter });
          callbackMap?.onSort?.();
        }
        break;
      case 'filter':
        if (!useDefaultFilter) {
          mergeState({ filterRule: filters as Record<string, string[]> });
          callbackMap?.onFilter?.();
        }
        break;
    }

    callbackMap?.onChange?.();
  };

  useEffect(() => {
    const ele = ref.current?.getRootDomElement();
    if (ele && getElement) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BaseTable
      ref={ref}
      rowKey={rowKey}
      className={css`
        ${customStyle?.content}
        ${rowClick ? rowClickStyle : ''}
      `}
      {...cProps}
      components={{
        header: {
          th: ResizableTitle,
        },
      }}
      columns={columns}
      pagination={
        enablePagination && {
          total: useCustomPagination ? total : sortedData.length,
          current: currentPage,
          pageSize,
          ...restPaginationProps,
        }
      }
      data={currentPageData}
      onChange={handleChange}
      rowSelection={{
        type: rowSelectionType,
        checkCrossPage: checkCrossPage,
        // This option is required to achieve multi-selection across pages when customizing paging
        preserveSelectedRowKeys: useCustomPagination ? checkCrossPage : undefined,
        onChange(selectedRowKeys, selectedRows) {
          currentChecked.current = selectedRowKeys;
          mergeState({
            selectedRowKeys: selectedRowKeys as string[],
            selectedRows,
          });
        },
      }}
      onRow={
        rowClick
          ? record => {
              return {
                onClick(event: React.ChangeEvent<HTMLButtonElement>) {
                  // When user clicks a radio or checkbox, the 'rowClicked' event should not be triggered.
                  const OPERATION_COLUMN_CLASS_SELECTOR = '.arco-table-operation';
                  if (event.target.closest(OPERATION_COLUMN_CLASS_SELECTOR) !== null)
                    return;
                  const tr = event.target.closest('tr');
                  const tbody = tr?.parentNode;
                  if (tbody) {
                    const prevSelectedEl = tbody.querySelector('.selected');
                    prevSelectedEl?.classList.remove('selected');
                  }
                  tr?.classList.add('selected');
                  currentClickedRow.current = record[rowKey];
                  mergeState({ clickedRow: record });
                  callbackMap?.onRowClick?.();
                },
              };
            }
          : undefined
      }
    />
  );
});
