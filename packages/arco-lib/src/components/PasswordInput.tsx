import { Input } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { PasswordInputPropsSpec as BasePasswordInputPropsSpec } from '../generated/types/PasswordInput';
import { useEffect, useState, useRef } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';

const InputPropsSpec = Type.Object({
  ...BasePasswordInputPropsSpec,
});
const InputStateSpec = Type.Object({
  value: Type.String(),
});

const BasePasswordInput = Input.Password;

const exampleProperties: Static<typeof InputPropsSpec> = {
  disabled: false,
  placeholder: 'please input',
  error: false,
  size: 'default',
  visibilityToggle: true,
};

export const PasswordInput = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'passwordInput',
    displayName: 'Password Input',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: InputPropsSpec,
    state: InputStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['input'],
    events: ['onChange', 'onBlur', 'onFocus', 'onPressEnter'],
  },
})(props => {
  const { getElement, customStyle, callbackMap, mergeState } = props;
  const { ...cProps } = getComponentProps(props);
  const [value, setValue] = useState('');
  const ref = useRef<RefInputType | null>(null);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BasePasswordInput
      ref={ref}
      className={css(customStyle?.input)}
      value={value}
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
      onPressEnter={() => {
        callbackMap?.onPressEnter?.();
      }}
      {...cProps}
    />
  );
});
