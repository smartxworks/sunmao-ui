import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';
import { CoreWidgetName, CORE_VERSION } from '@sunmao-ui/shared';

const expressionWidget = `${CORE_VERSION}/${CoreWidgetName.Expression}` as const;
const DisabledTimeSpec = {
  disabledHours: Type.Array(Type.Number(), {
    title: 'Disabled Hours',
    widget: expressionWidget,
  }),
  disabledMinutes: Type.Array(Type.Number(), {
    title: 'Disabled Minutes',
    widget: expressionWidget,
  }),
  disabledSeconds: Type.Array(Type.Number(), {
    title: 'Disabled Seconds',
    widget: expressionWidget,
  }),
};

export const RangePickerPropsSpec = {
  rangeDefaultValue: Type.Array(Type.Any(), {
    title: 'Default Value',
    category: Category.Basic,
    conditions: [
      {
        key: 'range',
        value: true,
      },
    ],
    widget: expressionWidget,
  }),
  rangePlaceholder: Type.Optional(
    Type.Array(Type.String(), {
      title: 'Placeholder',
      category: Category.Basic,
      widget: expressionWidget,
      conditions: [
        {
          key: 'range',
          value: true,
        },
      ],
    })
  ),
  order: Type.Boolean({
    title: 'Order',
    description: 'Whether the start and end times are automatically sorted',
    category: Category.Behavior,
    conditions: [
      {
        key: 'range',
        value: true,
      },
    ],
  }),
};

export const TimePickerPropsSpec = {
  range: Type.Boolean({
    title: 'Range',
    category: Category.Basic,
    weight: 100,
  }),
  defaultValue: Type.Any({
    title: 'Default Value',
    category: Category.Basic,
    conditions: [
      {
        key: 'range',
        value: false,
      },
    ],
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
  }),
  disableConfirm: Type.Boolean({
    title: 'Disable Confirm',
    category: Category.Behavior,
    description: '',
  }),
  hideDisabledOptions: Type.Boolean({
    title: 'Hide Disabled Options',
    category: Category.Behavior,
    description: '',
  }),
  use12Hours: Type.Boolean({
    title: 'Use 12 Hours',
    category: Category.Behavior,
  }),
  format: Type.String({
    title: 'Format',
    category: Category.Basic,
    description: '	Date format, refer to dayjs',
  }),
  step: Type.Object(
    {
      hour: Type.Number({
        title: 'Hour',
      }),
      minute: Type.Number({
        title: 'Minute',
      }),
      second: Type.Number({
        title: 'Second',
      }),
    },
    {
      title: 'Step',
      category: Category.Behavior,
      widget: expressionWidget,
      description: 'Set the hour/minute/second selection interval',
    }
  ),
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
  disabledTime: Type.Object(DisabledTimeSpec, {
    title: 'Disabled Time',
    category: Category.Behavior,
    description: '',
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
  showNowBtn: Type.Boolean({
    title: 'Show Now Button',
    category: Category.Behavior,
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    title: 'Size',
    category: Category.Layout,
  }),
  ...RangePickerPropsSpec,
};
