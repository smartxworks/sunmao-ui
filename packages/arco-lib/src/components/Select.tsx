import { Select as BaseSelect } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SelectPropsSpec as BaseSelectPropsSpec } from '../generated/types/Select';
import { useEffect, useState, useRef } from 'react';
import { SelectHandle } from '@arco-design/web-react/es/Select/interface';

const SelectPropsSpec = Type.Object({
  ...BaseSelectPropsSpec,
});
const SelectStateSpec = Type.Object({
  value: Type.String(),
});

const SelectImpl: ComponentImpl<Static<typeof SelectPropsSpec>> = props => {
  const { getElement, customStyle, callbackMap, mergeState, defaultValue = '' } = props;
  const { options = [], ...cProps } = getComponentProps(props);
  const [value, setValue] = useState<string>(defaultValue);
  const ref = useRef<SelectHandle | null>(null);
  useEffect(() => {
    mergeState({
      value,
    });
  }, [mergeState, value]);
  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BaseSelect
      ref={ref}
      className={css(customStyle?.content)}
      onChange={v => {
        setValue(v);
        callbackMap?.onChange?.();
      }}
      value={value}
      {...cProps}
      mode={cProps.multiple ? 'multiple' : undefined}
    >
      {options.map(o => (
        <BaseSelect.Option key={o.value} value={o.value} disabled={o.disabled}>
          {o.text}
        </BaseSelect.Option>
      ))}
    </BaseSelect>
  );
};

const exampleProperties: Static<typeof SelectPropsSpec> = {
  allowClear: false,
  multiple: false,
  allowCreate: false,
  bordered: true,
  defaultValue: 'alibaba',
  disabled: false,
  labelInValue: false,
  loading: false,
  options: [
    { value: 'alibaba', text: 'alibaba' },
    { value: 'baidu', text: 'baidu' },
    { value: 'tencent', text: 'tencent' },
  ],
  placeholder: 'Please select',
  size: 'default',
};

export const Select = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'select',
    displayName: 'Select',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: SelectPropsSpec,
    state: SelectStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(SelectImpl);
