import { DatePicker as BaseDatePicker } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  DatePickerPropsSpec as BaseDatePickerPropsSpec,
  RangePickerPropsSpec,
} from '../generated/types/DatePicker';
import {
  DisabledTimeFunc,
  DisabledTimeProps,
} from '@arco-design/web-react/es/DatePicker/interface';

const DatePickerPropsSpec = Type.Object(BaseDatePickerPropsSpec);
const DatePickerStateSpec = Type.Object({
  visible: Type.Boolean(),
  date: Type.Any(),
  dateString: Type.Union([Type.Array(Type.String()), Type.String()]),
});

const DatePickerType = {
  month: BaseDatePicker.MonthPicker,
  year: BaseDatePicker.YearPicker,
  week: BaseDatePicker.WeekPicker,
  quarter: BaseDatePicker.QuarterPicker,
  date: BaseDatePicker,
};
const RangePicker = BaseDatePicker.RangePicker;

const exampleProperties: Static<typeof DatePickerPropsSpec> = {
  disabled: false,
  placeholder: 'Please Select',
  position: 'bl',
  dayStartOfWeek: 0,
  allowClear: false,
  type: 'date',
  range: false,
  defaultValue: '',
  showTime: false,
  panelOnly: false,
  size: 'default',
  disabledTime: {
    disabledHours: [0, 1, 2],
    disabledMinutes: new Array(30).fill(0).map((e, i) => i),
    disabledSeconds: [10],
  },
  rangePlaceholder: ['Start date', 'End Date'],
  disabledRangeTime: {
    disabledHours: [
      [0, 1, 2],
      [7, 9, 10],
    ],
    disabledMinutes: [new Array(30).fill(0).map((e, i) => i), [58, 59]],
    disabledSeconds: [[], []],
  },
  disabledDate: {
    disabledType: 'range',
    dateRange: ['2022-5-23', '2022-5-26'],
  },
  rangeDisabled: [false, false],
  clearRangeOnReselect: false,
};

export const DatePicker = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'datePicker',
    displayName: 'DatePicker',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: DatePickerPropsSpec,
    state: DatePickerStateSpec,
    methods: {},
    slots: {
      footer: {
        slotProps: Type.Object({}),
      },
      triggerElement: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ['content'],
    events: ['onChange', 'onClear', 'onVisibleChange'],
  },
})(props => {
  const {
    disabledTime,
    disabledRangeTime,
    disabledDate,
    range,
    placeholder,
    rangePlaceholder,
    rangeDisabled,
    type,
    panelOnly,
    clearRangeOnReselect,
    ...cProps
  } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements, callbackMap, mergeState } = props;
  const Picker = DatePickerType[type];

  return (
    <span ref={elementRef} className={css(customStyle?.content)}>
      {range ? (
        <RangePicker
          disabledTime={(date, type) =>
            getDisabledRangeTime(date, type, disabledRangeTime!)
          }
          disabledDate={current => getDisabledDate(current, disabledDate)}
          extra={slotsElements.footer}
          triggerElement={panelOnly ? null : slotsElements.triggerElement}
          mode={type}
          placeholder={rangePlaceholder?.length === 0 ? undefined : rangePlaceholder}
          clearRangeOnReselect={clearRangeOnReselect}
          {...cProps}
          disabled={rangeDisabled}
          onChange={(dateString, date) => {
            mergeState({
              date,
              dateString,
            });
            callbackMap?.onChange?.();
          }}
          onVisibleChange={visible => {
            mergeState({ visible });
            callbackMap?.onVisibleChange?.();
          }}
        />
      ) : (
        <Picker
          disabledTime={date => getDisabledTime(date, disabledTime)}
          disabledDate={current => getDisabledDate(current, disabledDate)}
          extra={slotsElements.footer}
          triggerElement={panelOnly ? null : slotsElements.triggerElement}
          placeholder={placeholder}
          {...cProps}
          onChange={(dateString, date) => {
            mergeState({
              date,
              dateString,
            });
            callbackMap?.onChange?.();
          }}
          onVisibleChange={visible => {
            mergeState({ visible });
            callbackMap?.onVisibleChange?.();
          }}
        />
      )}
    </span>
  );
});

function getDisabledDate(
  date: Parameters<DisabledTimeFunc>[0],
  disabledDate: Static<typeof BaseDatePickerPropsSpec.disabledDate>
) {
  if (disabledDate.disabledType === 'after') {
    return date!.isAfter(disabledDate.date);
  }
  if (disabledDate.disabledType === 'before') {
    return date!.isBefore(disabledDate.date);
  }
  if (disabledDate.disabledType === 'range') {
    if (!disabledDate.dateRange || !Array.isArray(disabledDate.dateRange)) {
      return false;
    }
    for (let i = 0; i < disabledDate.dateRange.length; i++) {
      if (date!.isSame(disabledDate.dateRange[i])) {
        return true;
      }
    }
    return false;
  }
  return false;
}

function getDisabledTime(
  date: Parameters<DisabledTimeFunc>[0],
  range: Static<typeof BaseDatePickerPropsSpec.disabledTime>
): DisabledTimeProps {
  const result: DisabledTimeProps = {};

  Object.keys(range).forEach(disabledItem => {
    if (['disabledHours', 'disabledMinutes', 'disabledSeconds'].includes(disabledItem)) {
      const key = disabledItem as keyof typeof range;
      result[key] = () => range[key];
    }
  });

  return result;
}

function getDisabledRangeTime(
  date: Parameters<DisabledTimeFunc>[0],
  type: 'start' | 'end',
  range: Static<typeof RangePickerPropsSpec.disabledRangeTime>
): DisabledTimeProps {
  const result: DisabledTimeProps = {};

  Object.keys(range).forEach(disabledItem => {
    if (['disabledHours', 'disabledMinutes', 'disabledSeconds'].includes(disabledItem)) {
      const key = disabledItem as keyof typeof range;
      const [start, end] = range[key];
      result[key] = () => (type === 'start' ? start || [] : end || []);
    }
  });

  return result;
}
