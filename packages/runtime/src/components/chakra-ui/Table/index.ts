import { createComponent } from '@meta-ui/core';
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

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'table',
      description: 'chakra-ui table',
    },
    spec: {
      properties: [
        {
          name: 'data',
          ...DataPropertySchema,
        },
        {
          name: 'majorKey',
          ...MajorKeyPropertySchema,
        },
        {
          name: 'rowsPerPage',
          ...RowsPerPagePropertySchema,
        },
        {
          name: 'size',
          ...TableSizePropertySchema,
        },
        {
          name: 'columns',
          ...ColumnsPropertySchema,
        },
        {
          name: 'isMultiSelect',
          ...IsMultiSelectPropertySchema,
        },
      ],
      acceptTraits: [],
      state: TableStateSchema,
      methods: [],
    },
  }),
  impl: TableImpl,
};
