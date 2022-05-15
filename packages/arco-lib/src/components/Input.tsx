import { Input as BaseInput } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { InputPropsSpec as BaseInputPropsSpec } from '../generated/types/Input';
import { useEffect, useState, useRef, useCallback } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';

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
  placeholder: 'please input',
  error: false,
  size: 'default',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'input',
    displayName: 'Input',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: InputPropsSpec,
    state: InputStateSpec,
    methods: {},
    slots: {
      addAfter: { slotProps: Type.Object({}) },
      prefix: { slotProps: Type.Object({}) },
      suffix: { slotProps: Type.Object({}) },
      addBefore: { slotProps: Type.Object({}) },
    },
    styleSlots: ['input'],
    events: ['onChange', 'onBlur', 'onFocus', 'onClear', 'onPressEnter'],
  },
};

export const Input = implementRuntimeComponent(options)(props => {
  const { getElement, slotsElements, customStyle, callbackMap, mergeState } = props;
  const { defaultValue, ...cProps } = getComponentProps(props);
  const ref = useRef<RefInputType | null>(null);
  const [value, setValue] = useState(defaultValue);

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
    [mergeState, callbackMap]
  );

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
