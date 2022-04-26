import { Input } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TextAreaPropsSpec as BaseTextAreaPropsSpec } from '../generated/types/TextArea';
import { useEffect, useState, useRef } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';

const TextAreaPropsSpec = Type.Object({
  ...BaseTextAreaPropsSpec,
});
const TextAreaStateSpec = Type.Object({
  value: Type.String(),
});

const BaseTextArea = Input.TextArea;

const exampleProperties: Static<typeof TextAreaPropsSpec> = {
  allowClear: false,
  disabled: false,
  defaultValue: '',
  placeholder: 'please input',
  error: false,
  size: 'default',
  autoSize: true,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'textArea',
    displayName: 'TextArea',
    exampleProperties,
    annotations: {
      category: 'TextArea',
    },
  },
  spec: {
    properties: TextAreaPropsSpec,
    state: TextAreaStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['TextArea'],
    events: ['onChange', 'onBlur', 'onFocus', 'onClear', 'onPressEnter'],
  },
};

export const TextArea = implementRuntimeComponent(options)(props => {
  const { getElement, customStyle, callbackMap, mergeState } = props;
  const { defaultValue, ...cProps } = getComponentProps(props);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef<RefInputType | null>(null);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BaseTextArea
      ref={ref}
      className={css(customStyle?.TextArea)}
      value={value}
      onChange={value => {
        setValue(value);
        mergeState({
          value,
        });
        callbackMap?.onChange?.();
      }}
      onClear={() => {
        callbackMap?.onClear?.();
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
