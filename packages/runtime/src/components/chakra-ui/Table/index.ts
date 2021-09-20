import { createComponent } from '@meta-ui/core';
import { Type } from '@sinclair/typebox';
import { TableImpl } from './Table';
import {
  ColumnsPropertySchema,
  DataPropertySchema,
  MajorKeyPropertySchema,
  RowsPerPagePropertySchema,
  TableStateSchema,
  TableSizePropertySchema,
  IsMultiSelectPropertySchema,
} from './TableTypes';

const PropsSchema = Type.Object({
  data: DataPropertySchema,
  majorKey: MajorKeyPropertySchema,
  rowsPerPage: RowsPerPagePropertySchema,
  size: TableSizePropertySchema,
  columns: ColumnsPropertySchema,
  isMultiSelect: IsMultiSelectPropertySchema,
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'table',
      description: 'chakra-ui table',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: TableStateSchema,
      methods: [],
    },
  }),
  impl: TableImpl,
};
