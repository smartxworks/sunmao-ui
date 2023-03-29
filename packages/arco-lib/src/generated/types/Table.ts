import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { EventHandlerSpec } from '@sunmao-ui/shared';
import { Category } from '../../constants/category';

const PaginationSpec = Type.Object(
  {
    enablePagination: Type.Boolean({
      title: 'Enable Pagination',
    }),
    useCustomPagination: Type.Boolean({
      title: 'Enable Server Side Pagination',
      description: `If true, there will be no automatic pagination.    
        You can customize pagination with Pagination config and onPageChange events`,
      conditions: [
        {
          key: 'enablePagination',
          value: true,
        },
      ],
    }),
    total: Type.Optional(
      Type.Number({
        title: 'Total',
        category: Category.Basic,
        conditions: [
          {
            and: [
              {
                key: 'enablePagination',
                value: true,
              },
              {
                key: 'useCustomPagination',
                value: true,
              },
            ],
          },
        ],
      })
    ),
    pageSize: Type.Optional(
      Type.Number({
        title: 'Page Size',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
    defaultCurrent: Type.Optional(
      Type.Number({
        title: 'Default Current Page',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
    updateWhenDefaultPageChanges: Type.Boolean({
      title: 'Update When Default Page Changes',
      category: Category.Basic,
      conditions: [
        {
          key: 'enablePagination',
          value: true,
        },
      ],
    }),
    hideOnSinglePage: Type.Optional(
      Type.Boolean({
        title: 'Hide On Single Page',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
    size: Type.Optional(
      StringUnion(['mini', 'small', 'default', 'large'], {
        title: 'Size',
        category: Category.Style,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
    simple: Type.Optional(
      Type.Boolean({
        title: 'Simple',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
    showJumper: Type.Optional(
      Type.Boolean({
        title: 'Show Jumper',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
        description: 'Whether to display quick jump',
      })
    ),
    showTotal: Type.Optional(
      Type.Boolean({
        title: 'Show Total',
        category: Category.Basic,
        conditions: [
          {
            key: 'enablePagination',
            value: true,
          },
        ],
      })
    ),
  },
  {
    category: 'Pagination',
    description:
      'Custom pagination, dynamically update table data by setting total, pagesize, etc. and customize pagination style, size, etc',
  }
);

const moduleSpec = Type.Object(
  {
    id: Type.String({
      title: 'Module ID',
    }),
    type: Type.String({
      title: 'Module Type',
    }),
    properties: Type.Record(Type.String(), Type.Any(), {
      title: 'Module Properties',
      category: 'Basic',
      widget: 'core/v1/record',
    }),
    handlers: Type.Array(EventHandlerSpec, {
      title: 'Events',
    }),
  },
  {
    title: 'Module Config',
    conditions: [
      {
        key: 'type',
        value: 'module',
      },
    ],
  }
);

export const ColumnSpec = Type.Object({
  title: Type.String({
    title: 'Title',
    category: Category.Basic,
  }),
  type: Type.KeyOf(
    Type.Object({
      text: Type.String(),
      image: Type.String(),
      link: Type.String(),
      button: Type.String(),
      module: Type.String(),
      component: Type.String(),
    }),
    {
      title: 'Type',
      category: Category.Basic,
    }
  ),
  componentSlotIndex: Type.Number({
    title: 'Component Slot Index',
    conditions: [
      {
        key: 'type',
        value: 'component',
      },
    ],
  }),
  dataIndex: Type.String({
    title: 'Key',
    category: Category.Basic,
    description:
      'The key corresponding to the column data in the data item is used to display the value',
  }),
  displayValue: Type.String({
    title: 'Display Value',
    category: Category.Basic,
    description: 'The text you want to display instead of raw text',
    conditions: [
      {
        or: [
          {
            key: 'type',
            value: 'link',
          },
          {
            key: 'type',
            value: 'text',
          },
        ],
      },
    ],
  }),
  width: Type.Optional(
    Type.Number({
      title: 'Width',
    })
  ),
  ellipsis: Type.Optional(
    Type.Boolean({
      title: 'Ellipsis',
      description: `If the cell content exceeds the length, whether it is automatically omitted and displays ...,        
        After setting this property, the table-layout of the table will automatically become fixed.`,
    })
  ),
  sorter: Type.Optional(
    Type.Boolean({
      title: 'Enable Sort',
      conditions: [
        {
          key: 'type',
          value: 'text',
        },
      ],
    })
  ),
  filter: Type.Boolean({
    title: 'Enable Filter',
  }),
  sortDirections: Type.Optional(
    Type.Array(StringUnion(['descend', 'ascend']), {
      conditions: [
        {
          key: 'sorter',
          value: true,
        },
      ],
      widget: 'core/v1/expression',
    })
  ),
  btnCfg: Type.Optional(
    Type.Object(
      {
        text: Type.String({
          title: 'Text',
        }),
        handlers: Type.Array(EventHandlerSpec, {
          title: 'Events',
        }),
      },
      {
        title: 'Button Config',
        conditions: [
          {
            key: 'type',
            value: 'button',
          },
        ],
      }
    )
  ),
  module: Type.Optional(moduleSpec),
});

export const TablePropsSpec = Type.Object({
  data: Type.Array(Type.Any(), {
    title: 'Data',
    category: Category.Data,
    weight: 0,
    widget: 'core/v1/expression',
  }),
  columns: Type.Array(ColumnSpec, {
    title: 'Columns',
    description: '',
    category: Category.Columns,
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['title'],
    },
    weight: 0,
  }),
  rowKey: Type.Any({
    title: 'Row Key',
    category: Category.Columns,
    widget: 'arco/v1/primaryKey',
    description:
      'This optional is used to select a unique key for any given row from columns.',
  }),
  tableLayoutFixed: Type.Boolean({
    title: 'Layout Fixed',
    description:
      "The table's table-layout property is set to fixed. After set to fixed, the width of the table will not be stretched by the content beyond 100%",
    category: Category.Layout,
    weight: 1,
  }),
  border: Type.Boolean({
    title: 'Show Border',
    category: Category.Style,
    weight: 2,
  }),
  borderCell: Type.Boolean({
    title: 'Show Cell Border',
    description: 'Whether to display the table cell border',
    category: Category.Style,
    weight: 1,
  }),
  stripe: Type.Boolean({
    title: 'Show Stripe',
    description: 'Whether to show stripe style',
    category: Category.Style,
    weight: 2,
  }),
  pagination: PaginationSpec,
  size: StringUnion(['default', 'middle', 'small', 'mini'], {
    title: 'Size',
    description: 'table size',
    category: Category.Style,
    weight: 0,
  }),
  useDefaultFilter: Type.Optional(
    Type.Boolean({
      title: 'Default Filter',
      category: Category.Basic,
      description: 'If true, the built-in filter function will be used to filter',
    })
  ),
  useDefaultSort: Type.Optional(
    Type.Boolean({
      title: 'Default Sort',
      category: Category.Basic,
      description: 'If true, the built-in sort function will be used to sort',
    })
  ),
  pagePosition: StringUnion(['br', 'bl', 'tr', 'tl', 'topCenter', 'bottomCenter'], {
    title: 'Page Position',
    description: '',
    category: Category.Layout,
    weight: 10,
  }),
  rowClick: Type.Boolean({
    title: 'Row Click',
    category: Category.Basic,
    description: 'If on, the table can be selected without setting the rowSelectionType',
  }),
  checkCrossPage: Type.Boolean({
    title: 'Check Cross Page',
    category: Category.Basic,
    description:
      'Whether the checkboxes in multi-select mode cross pages。Please note that with this option on, if the data changes, the previous selected state will still be cached',
  }),
  rowSelectionType: StringUnion(['multiple', 'single', 'disable'], {
    title: 'Row Selection Type',
    category: Category.Basic,
  }),
  loading: Type.Boolean({
    title: 'Show Loading',
    category: Category.Basic,
  }),
});
