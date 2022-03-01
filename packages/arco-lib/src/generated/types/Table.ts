
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { EventHandlerSchema, ModuleSchema } from '@sunmao-ui/runtime'
import { Category } from '../../constants/category';

export const ColumnSchema = Type.Object({
  title: Type.String({
    title: 'Title',
    category: Category.Basic
  }),
  dataIndex: Type.String({
    title: 'Data Index',
    description: 'The key corresponding to the column data in the data item is used to display the value'
  }),
  displayValue: Type.String({
    title: 'Display Value',
    category: Category.Basic,
    description: 'The text you want to display instead of raw text.'
  }),
  sorter: Type.Boolean({
    title: 'Sortable'
  }),
  filter: Type.Boolean({
    title: 'Filterable'
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
    }),{
      title:'Type'
    }
  ),
  btnCfg: Type.Optional(Type.Object({
    text: Type.String(),
    handlers: Type.Array(EventHandlerSchema),
  })),
  module: Type.Optional(ModuleSchema),
})

export const TablePropsSchema = Type.Object({
  data: Type.Array(Type.Any(), {
    title: 'Data',
    widget: 'expression',
    category: 'Data',
    weight: 0
  }),
  columns: Type.Array(ColumnSchema, {
    title: 'Columns',
    widget: 'ColumnsForm',
    description: '',
    category: 'Columns',
    weight: 0
  }),
  tableLayoutFixed: Type.Boolean({
    title: 'Layout Fixed',
    description: "The table's table-layout property is set to fixed. After set to fixed, the width of the table will not be stretched by the content beyond 100%",
    category: Category.Layout,
    weight: 1
  }),
  border: Type.Boolean({
    title: 'Border',
    category: Category.Style,
    weight: 2
  }),
  borderCell: Type.Boolean({
    title: 'Border Cell',
    description: 'Whether to display the table cell border',
    category: Category.Style,
    weight: 1
  }),
  stripe: Type.Boolean({
    title: 'Stripe',
    widget: 'boolean',
    description: 'Whether to show stripe style',
    category: Category.Style,
    weight: 2
  }),
  pagination: Type.Object({
    pageSize: Type.Number({
      title:'PageSize',
    }),
  },{
    category:Category.Layout
  }),
  size: StringUnion(['default', 'middle', 'small', 'mini'], {
    title: 'Size',
    description: 'table size',
    category: Category.Style,
    weight: 0
  }),
  pagePosition: StringUnion(['br', 'bl', 'tr', 'tl', 'topCenter', 'bottomCenter'], {
    title: 'Page Position',
    description: '',
    category: Category.Layout,
    weight: 10
  }),
  rowSelectionType: StringUnion(["checkbox", "radio", "default"], {
    title: 'Row Selection Type',
    category: Category.Basic
  }),
  loading: Type.Boolean( {
    title: 'Loading',
    category: Category.Basic
  }),
});
