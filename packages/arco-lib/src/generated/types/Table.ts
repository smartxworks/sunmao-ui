
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { EventHandlerSchema, ModuleSchema } from '@sunmao-ui/runtime'

export const ColumnSchema = Type.Object({
  title: Type.String(),
  dataIndex: Type.String(),
  sorter: Type.Boolean(),
  filter: Type.Boolean(),
  sortDirections: Type.Optional(Type.Array(StringUnion(["descend", "ascend"]))),
  defaultSortOrder: Type.Optional(StringUnion(["descend", "ascend"])),
  type: Type.Optional(Type.KeyOf(
    Type.Object({
      text: Type.String(),
      image: Type.String(),
      link: Type.String(),
      button: Type.String(),
      module: Type.String(),
    })
  )),
  btnCfg: Type.Optional(Type.Object({
    text: Type.String(),
    handlers: Type.Array(EventHandlerSchema),
  })),
  module: Type.Optional(ModuleSchema)
})


export const TablePropsSchema = Type.Object({
  data: Type.Array(Type.Any()),
  columns: Type.Array(ColumnSchema),
  tableLayoutFixed: Type.Boolean(),
  borderCell: Type.Boolean(),
  stripe: Type.Boolean(),
  pagination: Type.Object({
    pageSize: Type.Number(),
    current: Type.Number(),
  }),
  size: StringUnion(['default', 'middle', 'small', 'mini']),
  pagePosition: StringUnion(['br', 'bl', 'tr', 'tl', 'topCenter', 'bottomCenter']),
  rowSelectionType: StringUnion(["checkbox", "radio", "default"]),
});
