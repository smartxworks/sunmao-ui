import { Type } from '@sinclair/typebox';
import { RuntimeModuleSchema, EventHandlerSchema } from '@sunmao-ui/runtime';

export const MajorKeyPropertySchema = Type.String();
export const RowsPerPagePropertySchema = Type.Number();
export const DataPropertySchema = Type.Array(Type.Any());
export const TableSizePropertySchema = Type.Optional(Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
));

export const TdTypeSchema = Type.KeyOf(
  Type.Object({
    text: Type.String(),
    image: Type.String(),
    link: Type.String(),
    button: Type.String(),
    module: Type.String(),
  })
);
export const ColumnSchema = Type.Object({
  key: Type.String(),
  title: Type.String(),
  displayValue: Type.Optional(Type.String()),
  type: TdTypeSchema,
  buttonConfig: Type.Object({
    text: Type.String(),
    handlers: Type.Array(EventHandlerSchema),
  }),
  module: RuntimeModuleSchema,
});

export const ColumnsPropertySchema = Type.Array(ColumnSchema);
export const IsMultiSelectPropertySchema = Type.Boolean();

export const TableStateSchema = Type.Object({
  selectedItem: Type.Optional(Type.Object({})),
  selectedItems: Type.Array(Type.Object({})),
});
