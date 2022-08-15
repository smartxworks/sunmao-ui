import { Type } from '@sinclair/typebox';
import {
  implementRuntimeComponent,
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
} from '@sunmao-ui/runtime';
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

export const implementTable = implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'table',
    displayName: 'Table',
    description: 'chakra-ui table',
    exampleProperties: {
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
            handlers: [],
          },
        },
      ],
      majorKey: 'id',
      rowsPerPage: 5,
      isMultiSelect: false,
      size: 'md',
    },
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    state: TableStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({
          [LIST_ITEM_EXP]: Type.Any(),
          [LIST_ITEM_INDEX_EXP]: Type.Number(),
        }),
      },
    },
    styleSlots: [],
    events: [],
  },
});
