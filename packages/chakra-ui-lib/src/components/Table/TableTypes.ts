import { Type } from '@sinclair/typebox';
import { ModuleSchema, EventHandlerSchema } from '@sunmao-ui/runtime';
import { BASIC, APPEARANCE, BEHAVIOR } from '../constants/category';

export const MajorKeyPropertySchema = Type.String({
  title: 'Major key',
  description: 'The key of the data item object to use as the major key',
  category: BASIC,
});
export const RowsPerPagePropertySchema = Type.Number({
  title: 'Per Page Number',
  category: BEHAVIOR,
});
export const DataPropertySchema = Type.Array(Type.Any(), {
  title: 'Data',
  category: BASIC,
});
export const TableSizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  }),
  {
    title: 'Size',
    category: APPEARANCE,
  }
);

export const TdTypeSchema = Type.KeyOf(
  Type.Object({
    text: Type.String(),
    image: Type.String(),
    link: Type.String(),
    button: Type.String(),
    module: Type.String(),
  }),
  {
    title: 'TD Type',
    category: APPEARANCE,
  }
);
export const ColumnSchema = Type.Object(
  {
    key: Type.String({
      title: 'Key',
    }),
    title: Type.String({
      title: 'Title',
    }),
    displayValue: Type.String({
      title: 'Display value',
    }),
    type: TdTypeSchema,
    buttonConfig: Type.Object(
      {
        text: Type.String({
          title: 'Button Text',
        }),
        handlers: Type.Array(EventHandlerSchema, {
          title: 'Button Handlers',
        }),
      },
      {
        title: 'Button Config',
      }
    ),
    module: ModuleSchema,
  },
  {
    title: 'Column',
  }
);

export const ColumnsPropertySchema = Type.Array(ColumnSchema, {
  title: 'Columns',
  category: BASIC,
  widgetOptions: {
    displayedKeys: ['title'],
  },
});
export const IsMultiSelectPropertySchema = Type.Boolean({
  title: 'Enable Multiple Select',
  category: BEHAVIOR,
});

export const TableStateSchema = Type.Object({
  selectedItem: Type.Optional(Type.Object({})),
  selectedItems: Type.Array(Type.Object({})),
});
