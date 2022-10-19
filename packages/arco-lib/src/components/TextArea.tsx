import { Input } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TextAreaPropsSpec as BaseTextAreaPropsSpec } from '../generated/types/TextArea';
import { useEffect, useRef } from 'react';
import { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useStateValue } from '../hooks/useStateValue';

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
  updateWhenDefaultValueChanges: false,
};

export const TextArea = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'textArea',
    displayName: 'TextArea',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: TextAreaPropsSpec,
    state: TextAreaStateSpec,
    methods: {
      setInputValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: {},
    styleSlots: ['TextArea'],
    events: ['onChange', 'onBlur', 'onFocus', 'onClear', 'onPressEnter'],
  },
})(props => {
  const {
    getElement,
    updateWhenDefaultValueChanges,
    customStyle,
    callbackMap,
    mergeState,
    subscribeMethods,
  } = props;
  const { defaultValue, ...cProps } = getComponentProps(props);
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
