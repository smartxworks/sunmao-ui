import { InputNumber } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { NumberInputPropsSpec as BaseNumberInputPropsSpec } from '../generated/types/NumberInput';
import { useEffect, useRef } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useStateValue } from '../hooks/useStateValue';

const InputPropsSpec = Type.Object({
  ...BaseNumberInputPropsSpec,
});
const InputStateSpec = Type.Object({
  value: Type.Number(),
});

const exampleProperties: Static<typeof InputPropsSpec> = {
  defaultValue: 1,
  disabled: false,
  placeholder: 'please input',
  error: false,
  size: 'default',
  buttonMode: false,
  min: 0,
  max: 5,
  readOnly: false,
  step: 1,
  precision: 1,
  updateWhenDefaultValueChanges: false,
};

export const NumberInput = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'numberInput',
    displayName: 'Number Input',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: InputPropsSpec,
    state: InputStateSpec,
    methods: {},
    slots: {
      prefix: { slotProps: Type.Object({}) },
      suffix: { slotProps: Type.Object({}) },
    },
    styleSlots: ['input'],
    events: ['onChange', 'onBlur', 'onFocus'],
  },
})(props => {
  const { getElement, slotsElements, customStyle, callbackMap, mergeState } = props;
  const { buttonMode, defaultValue, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const [value, setValue] = useStateValue(
    defaultValue,
    mergeState,
    updateWhenDefaultValueChanges,
    undefined,
    callbackMap?.onChange
  );
  const ref = useRef<RefInputType | null>(null);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <InputNumber
      ref={ref}
      className={css(customStyle?.input)}
      onChange={value => {
        setValue(value);
        mergeState({
          value,
        });
        callbackMap?.onChange?.();
      }}
      onBlur={() => {
        callbackMap?.onBlur?.();
      }}
      onFocus={() => {
        callbackMap?.onFocus?.();
      }}
      value={value}
      {...cProps}
      prefix={slotsElements.prefix ? slotsElements.prefix({}) : null}
      suffix={slotsElements.suffix ? slotsElements.suffix({}) : null}
      mode={buttonMode ? 'button' : 'embed'}
    />
  );
});
