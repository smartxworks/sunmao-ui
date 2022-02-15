
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { EventHandlerSchema, ModuleSchema } from '@sunmao-ui/runtime'
import { Category } from '../../constants/category';

export const ColumnSchema = Type.Object({
  title: Type.String({
    title: 'title',
    category: Category.General
  }),
  dataIndex: Type.String({
    title: 'dataIndex',
    description: 'The key corresponding to the column data in the data item is used to display the value'
  }),
  sorter: Type.Boolean({
    title: 'Show sorter button'
  }),
  filter: Type.Boolean({
    title: 'Show filter button'
  }),
  sortDirections: Type.Optional(Type.Array(StringUnion(["descend", "ascend"]))),
  defaultSortOrder: Type.Optional(StringUnion(["descend", "ascend"])),
  type: Type.KeyOf(
    Type.Object({
      text: Type.String(),
      image: Type.String(),
      link: Type.String(),
      button: Type.String(),
      module: Type.String(),
    })
  ),
  btnCfg: Type.Optional(Type.Object({
    text: Type.String(),
    handlers: Type.Array(EventHandlerSchema),
  })),
  module: Type.Optional(ModuleSchema),
})

export const TablePropsSchema = Type.Object({
  data: Type.Array(Type.Any(), {
    title: 'data',
    widget: 'CodeEditor',
    category: 'Data',
    weight: 0
  }),
  columns: Type.Array(ColumnSchema, {
    title: 'columns',
    widget: 'ColumnsForm',
    description: '',
    category: 'Columns',
    weight: 0
  }),
  tableLayoutFixed: Type.Boolean({
    title: 'tableLayoutFixed',
    description: "The table's table-layout property is set to fixed. After set to fixed, the width of the table will not be stretched by the content beyond 100%",
    category: Category.Layout,
    weight: 1
  }),
  borderCell: Type.Boolean({
    title: 'borderCell',
    description: 'Whether to display the table cell border',
    category: Category.Style,
    weight: 1
  }),
  stripe: Type.Boolean({
    title: 'stripe',
    widget: 'boolean',
    description: 'Whether to show stripe style',
    category: Category.Style,
    weight: 2
  }),
  pagination: Type.Object({
    pageSize: Type.Number(),
  }),
  size: StringUnion(['default', 'middle', 'small', 'mini'], {
    title: 'size',
    description: 'table size',
    category: Category.Style,
    weight: 0
  }),
  pagePosition: StringUnion(['br', 'bl', 'tr', 'tl', 'topCenter', 'bottomCenter'], {
    title: 'pagePosition',
    description: '',
    category: Category.Layout,
    weight: 10
  }),
  rowSelectionType: StringUnion(["checkbox", "radio", "default"], {
    title: 'rowSelectionType',
    weight: 3,
    category: Category.Style
  }),
});
