import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import {
  ColumnsPropertySpec,
  DataPropertySpec,
  MajorKeyPropertySpec,
  RowsPerPagePropertySpec,
  TableStateSpec,
  TableSizePropertySpec,
  IsMultiSelectPropertySpec,
} from './TableTypes';

const PropsSpec = Type.Object({
  data: DataPropertySpec,
  majorKey: MajorKeyPropertySpec,
  columns: ColumnsPropertySpec,
  isMultiSelect: IsMultiSelectPropertySpec,
  rowsPerPage: RowsPerPagePropertySpec,
  size: TableSizePropertySpec,
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
      displayValue: '',
      buttonConfig: {
        handlers: []
      }
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
    properties: PropsSpec,
    state: TableStateSpec,
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
});
