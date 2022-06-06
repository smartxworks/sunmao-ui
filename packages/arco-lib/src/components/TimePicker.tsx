import { TimePicker as BaseTimePicker } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TimePickerPropsSpec as BaseTimePickerPropsSpec } from '../generated/types/TimePicker';
import { Dayjs } from './DatePicker';

const TimePickerPropsSpec = Type.Object(BaseTimePickerPropsSpec);
const TimePickerStateSpec = Type.Object({
  visible: Type.Boolean(),
  time: Type.Any(),
  timeString: Type.Union([Type.Array(Type.String()), Type.String()]),
});

const exampleProperties: Static<typeof TimePickerPropsSpec> = {
  disabled: false,
  disableConfirm: false,
  hideDisabledOptions: false,
  step: {
    hour: 1,
    minute: 1,
    second: 1,
  },
  showNowButton: true,
  placeholder: 'Please Select',
  position: 'bl',
  format: 'HH:mm:ss',
  allowClear: false,
  defaultValue: '18:24:23',
  rangeDefaultValue: ['09:24:53', '18:44:33'],
  range: false,
  size: 'default',
  use12Hours: false,
  disabledTime: {
    disabledHours: [0, 1, 2],
    disabledMinutes: new Array(30).fill(0).map((e, i) => i),
    disabledSeconds: [10],
  },
  rangePlaceholder: ['Start date', 'End Date'],
  useUtcOffset: false,
  order: false,
  utcOffset: 0,
  timezone: '',
};
const RangePicker = BaseTimePicker.RangePicker;

export const TimePicker = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'timePicker',
    displayName: 'TimePicker',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: TimePickerPropsSpec,
    state: TimePickerStateSpec,
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
    range,
    disabledTime,
    useUtcOffset,
    utcOffset,
    rangeDefaultValue,
    rangePlaceholder,
    ...cProps
  } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements, callbackMap, mergeState } = props;

  const pickerProps = {
    extra: slotsElements.footer,
    utcOffset: useUtcOffset ? utcOffset : undefined,
    onChange: (timeString: string | string[], time: Dayjs | Dayjs[]) => {
      mergeState({
        time,
        timeString,
      });
      callbackMap?.onChange?.();
    },
    ...getDisabledTime(disabledTime),
    ...cProps,
  };

  return (
    <span ref={elementRef} className={css(customStyle?.content)}>
      {range ? (
        <RangePicker
          {...pickerProps}
          defaultValue={rangeDefaultValue}
          placeholder={rangePlaceholder}
        />
      ) : (
        <BaseTimePicker {...pickerProps} />
      )}
    </span>
  );
});

function getDisabledTime(
  disabledTime: Static<typeof BaseTimePickerPropsSpec.disabledTime>
) {
  return {
    disabledHours: () => disabledTime.disabledHours,
    disabledMinutes: () => disabledTime.disabledMinutes,
    disabledSeconds: () => disabledTime.disabledSeconds,
  };
}
