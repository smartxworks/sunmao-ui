
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const handlerSchema = Type.Array(Type.Object({
  componentId: Type.String(),
  type: Type.String(),
  method: Type.Object({
    name: Type.String(),
    parameters: Type.Optional(Type.Object(Type.Any()))
  })
}))

export const ColumnSchema = Type.Object({
  title: Type.String(),
  dataIndex: Type.String(),
  sorter: Type.Optional(Type.Boolean()),
  filter:Type.Optional(Type.Boolean()),
  sortDirections: Type.Optional(Type.Array(StringUnion(["descend" ,"ascend"]))),
  defaultSortOrder: Type.Optional(StringUnion(["descend" ,"ascend"])),
  type: Type.Optional(Type.String()),
  btnCfg: Type.Optional(Type.Object({
    text: Type.String(),
    handlers: handlerSchema,
  })),
  module: Type.Optional(Type.Object({
    id: Type.String(),
    handlers: handlerSchema,
    properties: Type.Array(Type.Any()),
    type: Type.String()
  }))
})


export const TablePropsSchema = Type.Object({
  className: Type.Optional(Type.String()),
  tableLayoutFixed: Type.Optional(Type.Boolean()),
  borderCell: Type.Optional(Type.Boolean()),
  hover: Type.Optional(Type.Boolean()),
  defaultExpandAllRows: Type.Optional(Type.Boolean()),
  showHeader: Type.Optional(Type.Boolean()),
  stripe: Type.Optional(Type.Boolean()),
  pagination:Type.Object({
    pageSize:Type.Number(),
    current:Type.Number(),
  }),
  size: Type.Optional(StringUnion(['default', 'middle', 'small', 'mini'])),
  pagePosition: Type.Optional(StringUnion(['br', 'bl', 'tr', 'tl', 'topCenter', 'bottomCenter'])),
  indentSize: Type.Optional(Type.Number()),
  virtualized: Type.Optional(Type.Boolean()),
  rowSelectionType: Type.Optional(StringUnion(["checkbox", "radio", "default"])),
  data: Type.Optional(Type.Array(Type.Any())),
  columns: Type.Optional(Type.Array(ColumnSchema)),
});
