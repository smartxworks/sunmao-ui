import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
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
  columns: ColumnsPropertySchema,
  isMultiSelect: IsMultiSelectPropertySchema,
  rowsPerPage: RowsPerPagePropertySchema,
  size: TableSizePropertySchema,
});

const exampleProperties = {
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
  size: 'md',
};

export const implementTable = implementRuntimeComponent({
  kind: 'Component',
  version: 'chakra_ui/v1',
  metadata: {
    name: 'table',
    displayName: 'Table',
    description: 'chakra-ui table',
    isDraggable: true,
    isResizable: true,
    exampleProperties,
    exampleSize: [8, 6],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSchema,
    state: TableStateSchema,
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
});
