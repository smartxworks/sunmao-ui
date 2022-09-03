import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';
import { CoreWidgetName, CORE_VERSION } from '@sunmao-ui/shared';

const DisabledDateSpec = {
  disabledType: StringUnion(['before', 'after', 'range'], {
    title: 'Type',
  }),
  date: Type.Optional(
    Type.Any({
      title: 'Date',
      conditions: [{ key: 'disabledType', not: 'range' }],
    })
  ),
  dateRange: Type.Optional(
    Type.Array(Type.Any(), {
      title: 'Date Range',
      widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
      conditions: [{ key: 'disabledType', value: 'range' }],
    })
  ),
};

const DisabledTimeSpec = {
  disabledHours: Type.Array(Type.Number(), {
    title: 'Disabled Hours',
    widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
  }),
  disabledMinutes: Type.Array(Type.Number(), {
    title: 'Disabled Minutes',
    widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
  }),
  disabledSeconds: Type.Array(Type.Number(), {
    title: 'Disabled Seconds',
    widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
  }),
};

const DisabledTimeRangeItemSpec = Type.Array(Type.Number(), {
  widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
});

const DisabledTimeRangeSpec = {
  disabledHours: Type.Tuple([DisabledTimeRangeItemSpec, DisabledTimeRangeItemSpec], {
    title: 'Disabled Hours',
  }),
  disabledMinutes: Type.Tuple([DisabledTimeRangeItemSpec, DisabledTimeRangeItemSpec], {
    title: 'Disabled Minutes',
  }),
  disabledSeconds: Type.Tuple([DisabledTimeRangeItemSpec, DisabledTimeRangeItemSpec], {
    title: 'Disabled Seconds',
  }),
};

export const RangePickerPropsSpec = {
  disabledRangeTime: Type.Optional(
    Type.Object(DisabledTimeRangeSpec, {
      title: 'Disabled Range Time',
      category: Category.Behavior,
      weight: 95,
      description:
        'Specify the disable time, you need to specify two arrays, 0 for the start time and 1 for the end time',
      conditions: [
        {
          and: [
            {
              key: 'showTime',
              value: true,
            },
            {
              key: 'range',
              value: true,
            },
          ],
        },
      ],
    })
  ),
  rangePlaceholder: Type.Optional(
    Type.Array(Type.String(), {
      title: 'Placeholder',
      category: Category.Basic,
      conditions: [
        {
          key: 'range',
          value: true,
        },
      ],
    })
  ),
  rangeDisabled: Type.Tuple([Type.Boolean(), Type.Boolean()], {
    title: 'Disabled',
    category: Category.Behavior,
    widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
    weight: 99,
    conditions: [
      {
        key: 'range',
        value: true,
      },
    ],
  }),
  clearRangeOnReselect: Type.Boolean({
    title: 'Clear Range On Reselect',
    description:
      'When reselect the range, the previous range will be cleared for next selection',
    category: Category.Behavior,
    conditions: [
      {
        key: 'range',
        value: true,
      },
    ],
  }),
};

export const DatePickerPropsSpec = {
  range: Type.Boolean({
    title: 'Range',
    category: Category.Behavior,
    weight: 100,
  }),
  type: StringUnion(['date', 'week', 'month', 'year', 'quarter'], {
    title: 'Type',
    category: Category.Basic,
  }),
  defaultValue: Type.Any({
    title: 'Default Value',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
    weight: 99,
    conditions: [
      {
        key: 'range',
        value: false,
      },
    ],
  }),
  dayStartOfWeek: StringUnion([0, 1, 2, 3, 4, 5, 6], {
    title: 'Day Start Of Week',
    category: Category.Basic,
    conditions: [
      {
        key: 'type',
        value: 'default',
      },
    ],
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title: 'Position',
    category: Category.Layout,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
    conditions: [
      {
        key: 'range',
        value: false,
      },
    ],
  }),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
    weight: 98,
  }),
  showTime: Type.Optional(
    Type.Boolean({
      title: 'Show Time',
      category: Category.Behavior,
      conditions: [
        {
          key: 'type',
          value: 'date',
        },
      ],
      weight: 97,
    })
  ),
  disabledDate: Type.Object(DisabledDateSpec, {
    title: 'Disabled Date',
    category: Category.Behavior,
    description:
      "Specify a date and use before to disable dates before that date and after to disable dates after that date. Or disable certain dates by passing an array, which supports the use of dayjs, e.g. ['2022-5-23', '2022-5-26', '2022-5-29'].",
    widget: `${CORE_VERSION}/${CoreWidgetName.Popover}`,
    weight: 96,
  }),
  disabledTime: Type.Object(DisabledTimeSpec, {
    title: 'Disabled Time',
    category: Category.Behavior,
    description: '',
    weight: 95,
    conditions: [
      {
        and: [
          {
            key: 'showTime',
            value: true,
          },
          {
            key: 'range',
            value: false,
          },
        ],
      },
    ],
  }),
  panelOnly: Type.Boolean({
    title: 'Only Use Panel',
    category: Category.Behavior,
    weight: 0,
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    title: 'Size',
    category: Category.Layout,
  }),
  timezone: Type.String({
    title: 'Timezone',
    category: Category.Behavior,
  }),
  useUtcOffset: Type.Boolean({
    title: 'Open UTC Offset',
    category: Category.Behavior,
  }),
  utcOffset: Type.Number({
    title: 'UTC Offset',
    category: Category.Behavior,
    conditions: [
      {
        key: 'useUtcOffset',
        value: true,
      },
    ],
  }),
  ...RangePickerPropsSpec,
};
