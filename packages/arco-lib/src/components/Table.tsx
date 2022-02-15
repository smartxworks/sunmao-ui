import {
  Button,
  Link,
  Input,
  Table as BaseTable,
  PaginationProps,
} from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TablePropsSchema, ColumnSchema } from "../generated/types/Table";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { sortBy } from "lodash-es";
import {
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleRenderer,
} from "@sunmao-ui/runtime";

const TableStateSchema = Type.Object({
  selectedRows: Type.Array(Type.Any()),
  selectedRow: Type.Optional(Type.Any()),
  selectedRowKeys: Type.Array(Type.Number()),
});

type SortRule = {
  field: string;
  direction?: "ascend" | "descend";
};

type ColumnProperty = Static<typeof ColumnSchema> & {
  filterDropdown?: ({
    filterKeys,
    setFilterKeys,
    confirm,
  }: filterDropdownParam) => ReactNode;
  render?: (ceilValue: any, record: any, index: number) => ReactNode;
};

type filterDropdownParam = {
  filterKeys?: string[];
  setFilterKeys?: (filterKeys: string[], callback?: Function) => void;
  confirm?: Function;
};
const TableImpl: ComponentImpl<Static<typeof TablePropsSchema>> = (props) => {
  const { elementRef, app, mergeState, customStyle, services, data } = props;

  const { pagination, ...cProps } = getComponentProps(props);

  const rowSelectionType: "checkbox" | "radio" | undefined =
    cProps.rowSelectionType === "default" ? undefined : cProps.rowSelectionType;

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortRule, setSortRule] = useState<SortRule>({
    field: "name",
    direction: undefined,
  });
  const [filterRule, setFilterRule] = useState();

  const filteredData = useMemo(() => {
    let filteredData = Array.isArray(data) ? data : [];
    if (filterRule) {
      Object.keys(filterRule).forEach((colIdx) => {
        const value = filterRule[colIdx][0];
        filteredData = filteredData?.filter((row) =>
          value ? row[colIdx].indexOf(value) !== -1 : true
        );
      });
    }
    return filteredData;
  }, [data, filterRule]);

  const sortedData = useMemo(() => {
    if (!sortRule || !sortRule.direction) {
      return filteredData;
    }

    const sorted = sortBy(filteredData, sortRule.field);
    return sortRule.direction === "ascend" ? sorted : sorted.reverse();
  }, [filteredData, sortRule]);

  const { pageSize } = pagination;
  const currentPageData = sortedData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    mergeState({
      selectedRowKeys,
    });
  }, [selectedRowKeys, mergeState]);

  const inputRef = useRef(null);

  const columns = cProps.columns!.map((column) => {
    const newColumn: ColumnProperty = { ...column };
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
              value={filterKeys?.[0] || ""}
              onChange={(value) => {
                setFilterKeys && setFilterKeys(value ? [value] : []);
              }}
              onSearch={() => {
                confirm && confirm();
              }}
            />
          </div>
        );
      };
    }

    newColumn.render = (ceilValue: any, record: any, index: number) => {
      const value = record[newColumn.dataIndex];

      let colItem;

      switch (newColumn.type) {
        case "button":
          const handleClick = () => {
            newColumn.btnCfg?.handlers.forEach((handler) => {
              services.apiService.send("uiMethod", {
                componentId: handler.componentId,
                name: handler.method.name,
                parameters: handler.method.parameters || {},
              });
            });
          };
          colItem = (
            <Button
              onClick={() => {
                handleClick();
              }}
            >
              {newColumn.btnCfg?.text}
            </Button>
          );
          break;
        case "link":
          colItem = <Link href={value}>{value}</Link>;
          break;
        case "module":
          const evalScope = {
            [LIST_ITEM_EXP]: record,
            [LIST_ITEM_INDEX_EXP]: index,
          };
          colItem = (
            <ModuleRenderer
              app={app}
              evalScope={evalScope}
              handlers={newColumn.module?.handlers || []}
              id={newColumn.module?.id || ""}
              properties={newColumn.module?.properties || {}}
              services={services}
              type={newColumn.module?.type || ""}
            />
          );
          break;
        default:
          colItem = <span>{value}</span>;
          break;
      }
      return colItem;
    };
    return newColumn;
  });

  const handleChange = (
    pagination: PaginationProps,
    sorter: { field?: string; direction?: "descend" | "ascend" },
    filter: any
  ) => {
    const { current } = pagination;
    if (current !== currentPage) {
      setCurrentPage(current!);
      return;
    }

    // TODO can be optimized
    setSortRule(sorter as SortRule);

    setFilterRule(filter);
  };

  return (
    <BaseTable
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      columns={columns}
      pagination={{
        total: sortedData!.length,
        current: currentPage,
        pageSize,
      }}
      data={currentPageData}
      onChange={handleChange}
      rowSelection={{
        type: rowSelectionType,
        selectedRowKeys,
        onChange(selectedRowKeys) {
          setSelectedRowKeys(selectedRowKeys as string[]);
        },
        onSelect: (selected, record, selectedRows) => {
          selected && mergeState({ selectedRow: record });
          mergeState({ selectedRows });
        },
        onSelectAll(selected, selectedRows) {
          mergeState({ selectedRows });
        },
      }}
    />
  );
};

export const exampleProperties: Static<typeof TablePropsSchema> = {
  columns: [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortDirections: ["ascend"],
      defaultSortOrder: "ascend",
      type: "text",
      filter: true,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: true,
      filter: false,
      type: "text",
    },
    {
      title: "Time",
      dataIndex: "time",
      sorter: true,
      filter: false,
      type: "text",
    },
    {
      title: "Link",
      dataIndex: "link",
      type: "link",
      filter: true,
      sorter: false,
    },
    {
      title: "CustomComponent",
      dataIndex: "customComponent",
      type: "module",
      filter: false,
      sorter: false,
      module: {
        id: "clistItemName-{{$listItem.id}}",
        handlers: [],
        properties: [],
        type: "core/v1/text",
      },
    },
  ],
  data: Array(13)
    .fill("")
    .map((_, index) => ({
      key: `key ${index}`,
      name: `${Math.random() > 0.5 ? "Kevin Sandra" : "xzdry"}${index}`,
      link: `link${Math.random() > 0.5 ? "-A" : "-B"}`,
      salary: Math.floor(Math.random() * 1000),
      time: `2021-${Math.floor(Math.random() * 11)}-11T${Math.floor(
        Math.random() * 23
      )}:10:45.437Z`,
    })),
  pagination: {
    pageSize: 6,
  },
  tableLayoutFixed: false,
  borderCell: false,
  stripe: false,
  size: "default",
  pagePosition: "bottomCenter",
  rowSelectionType: "radio",
};

export const Table = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    annotations: {
      category: "Display",
    },
    name: "table",
    displayName: "Table",
  },
  spec: {
    properties: TablePropsSchema,
    state: TableStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
})(TableImpl);
