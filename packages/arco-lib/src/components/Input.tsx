import { Input as BaseInput } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { InputPropsSpec as BaseInputPropsSpec } from '../generated/types/Input';
import { useEffect, useRef, useCallback } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useStateValue } from '../hooks/useStateValue';

const InputPropsSpec = Type.Object({
  ...BaseInputPropsSpec,
});
const InputStateSpec = Type.Object({
  value: Type.String(),
});

const exampleProperties: Static<typeof InputPropsSpec> = {
  allowClear: false,
  disabled: false,
  readOnly: false,
  defaultValue: '',
  updateWhenDefaultValueChanges: false,
  placeholder: 'please input',
  error: false,
  size: 'default',
};

export const Input = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'input',
    displayName: 'Input',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: InputPropsSpec,
    state: InputStateSpec,
    methods: {
      setInputValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: {
      addAfter: { slotProps: Type.Object({}) },
      prefix: { slotProps: Type.Object({}) },
      suffix: { slotProps: Type.Object({}) },
      addBefore: { slotProps: Type.Object({}) },
    },
    styleSlots: ['input'],
    events: ['onChange', 'onBlur', 'onFocus', 'onClear', 'onPressEnter'],
  },
})(props => {
  const {
    getElement,
    slotsElements,
    customStyle,
    callbackMap,
    mergeState,
    subscribeMethods,
  } = props;

  const { updateWhenDefaultValueChanges, defaultValue, ...cProps } =
    getComponentProps(props);
  const ref = useRef<RefInputType | null>(null);
  const [value, setValue] = useStateValue(
    defaultValue,
    mergeState,
    updateWhenDefaultValueChanges
  );

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  const onChange = useCallback(
    value => {
      setValue(value);
      mergeState({ value });
      callbackMap?.onChange?.();
    },
    [setValue, mergeState, callbackMap]
  );

  useEffect(() => {
    subscribeMethods({
      setInputValue({ value }) {
        setValue(value);
        mergeState({ value });
        callbackMap?.onChange?.();
      },
    });
  }, [setValue, mergeState, callbackMap, subscribeMethods]);

  return (
    <BaseInput
      className={css(customStyle?.input)}
      ref={ref}
      addAfter={slotsElements.addAfter ? slotsElements.addAfter({}) : null}
      addBefore={slotsElements.addBefore ? slotsElements.addBefore({}) : null}
      prefix={slotsElements.prefix ? slotsElements.prefix({}) : null}
      suffix={slotsElements.suffix ? slotsElements.suffix({}) : null}
      value={value}
      onChange={onChange}
      onClear={() => {
        callbackMap?.onClear?.();
      }}
      onPressEnter={() => {
        callbackMap?.onPressEnter?.();
      }}
      onBlur={() => {
        callbackMap?.onBlur?.();
      }}
      onFocus={() => {
        callbackMap?.onFocus?.();
      }}
      {...cProps}
    />
  );
});
