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

const defaultProperties = {
  data: [
    {
      id: '1',
      name: 'Bowen Tan',
    },
  ],
  columns: [
    {
      key: 'name',
      title: 'Name',
      type: 'text',
    },
  ],
  majorKey: 'id',
  rowsPerPage: 5,
  isMultiSelect: false,
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'table',
      displayName: 'Table',
      description: 'chakra-ui table',
      isDraggable: true,
      isResizable: true,
      defaultProperties,
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
