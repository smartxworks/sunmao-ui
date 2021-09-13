import { Type } from '@sinclair/typebox';

export const MajorKeyPropertySchema = Type.String();
export const RowsPerPagePropertySchema = Type.Number();
export const DataPropertySchema = Type.Array(Type.Any());
export const TableSizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);

export const TdTypeSchema = Type.KeyOf(
  Type.Object({
    text: Type.String(),
    image: Type.String(),
    button: Type.String(),
  })
);
export const ColumnSchema = Type.Object({
  key: Type.String(),
  title: Type.String(),
  displayValue: Type.Optional(Type.String()),
  type: TdTypeSchema,
  buttonConfig: Type.Object({
    text: Type.String(),
    events: Type.Array(
      Type.Object({
        componentId: Type.String(),
        method: Type.Object({
          name: Type.String(),
          parameters: Type.Any(),
        }),
      })
    ),
  }),
});

export const ColumnsPropertySchema = Type.Array(ColumnSchema);
export const IsMultiSelectPropertySchema = Type.Boolean();

export const TableStateSchema = Type.Object({
  selectedItem: Type.Optional(Type.Object({})),
  selectedItems: Type.Array(Type.Object({})),
});
