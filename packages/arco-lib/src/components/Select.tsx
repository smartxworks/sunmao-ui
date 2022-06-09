import { Select as BaseSelect } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SelectPropsSpec as BaseSelectPropsSpec } from '../generated/types/Select';
import { useEffect, useRef } from 'react';
import { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { useStateValue } from '../hooks/useStateValue';

const SelectPropsSpec = Type.Object({
  ...BaseSelectPropsSpec,
});
const SelectStateSpec = Type.Object({
  value: Type.String(),
});

const exampleProperties: Static<typeof SelectPropsSpec> = {
  allowClear: false,
  multiple: false,
  allowCreate: false,
  bordered: true,
  defaultValue: 'Beijing',
  disabled: false,
  labelInValue: false,
  loading: false,
  showSearch: false,
  unmountOnExit: false,
  options: [
    { value: 'Beijing', text: 'Beijing' },
    { value: 'London', text: 'London' },
    { value: 'NewYork', text: 'NewYork' },
  ],
  placeholder: 'Select city',
  size: 'default',
  error: false,
  updateWhenDefaultValueChanges: false,
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
    slots: {
      dropdownRenderSlot: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content', 'dropdownRenderWrap'],
    events: ['onChange', 'onClear', 'onBlur', 'onFocus'],
  },
})(props => {
  const {
    getElement,
    slotsElements,
    customStyle,
    callbackMap,
    mergeState,
    defaultValue = '',
  } = props;
  const {
    options = [],
    retainInputValue,
    updateWhenDefaultValueChanges,
    ...cProps
  } = getComponentProps(props);
  const [value, setValue] = useStateValue(
    defaultValue,
    mergeState,
    updateWhenDefaultValueChanges
  );
  const ref = useRef<SelectHandle | null>(null);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  const showSearch = cProps.showSearch && {
    retainInputValue,
    retainInputValueWhileSelect: retainInputValue,
  };

  return (
    <BaseSelect
      ref={ref}
      className={css(customStyle?.content)}
      onChange={v => {
        setValue(v);
        mergeState({
          value: v,
        });
        callbackMap?.onChange?.();
      }}
      value={value}
      {...cProps}
      showSearch={showSearch}
      filterOption={(inputValue, option) =>
        option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
        option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      }
      dropdownRender={menu => {
        return (
          <div className={css(customStyle?.dropdownRenderWrap)}>
            {menu}
            {slotsElements.dropdownRenderSlot
              ? slotsElements.dropdownRenderSlot({})
              : null}
          </div>
        );
      }}
      mode={cProps.multiple ? 'multiple' : undefined}
      onClear={() => {
        callbackMap?.onClear?.();
      }}
      onBlur={() => {
        callbackMap?.onBlur?.();
      }}
      onFocus={() => {
        callbackMap?.onFocus?.();
      }}
    >
      {options.map(o => (
        <BaseSelect.Option key={o.value} value={o.value} disabled={o.disabled}>
          {o.text || o.value}
        </BaseSelect.Option>
      ))}
    </BaseSelect>
  );
});
