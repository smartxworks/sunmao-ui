import { Select as BaseSelect } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
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

export const Select = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'select',
    displayName: 'Select',
    exampleProperties: {
      allowClear: false,
      multiple: false,
      allowCreate: false,
      bordered: true,
      defaultValue: 'Beijing',
      disabled: false,
      labelInValue: false,
      loading: false,
      showSearch: false,
      unmountOnExit: true,
      showTitle: false,
      options: [
        { value: 'Beijing', text: 'Beijing' },
        { value: 'London', text: 'London' },
        { value: 'NewYork', text: 'NewYork' },
      ],
      placeholder: 'Select city',
      size: 'default',
      error: false,
      updateWhenDefaultValueChanges: false,
      autoFixPosition: false,
      autoAlignPopupMinWidth: false,
      autoAlignPopupWidth: true,
      autoFitPosition: false,
      position: 'bottom',
      mountToBody: true,
    },
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: SelectPropsSpec,
    state: SelectStateSpec,
    methods: {
      setValue: Type.Object({
        value: Type.String(),
      }),
    },
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
    defaultValue,
    subscribeMethods,
  } = props;
  const {
    options = [],
    retainInputValue,
    updateWhenDefaultValueChanges,
    showTitle,
    mountToBody,
    autoFixPosition,
    autoAlignPopupMinWidth,
    autoAlignPopupWidth,
    autoFitPosition,
    position,
    ...cProps
  } = getComponentProps(props);

  const [value, setValue] = useStateValue(
    defaultValue || undefined,
    mergeState,
    updateWhenDefaultValueChanges,
    undefined,
    callbackMap?.onChange
  );

  const ref = useRef<SelectHandle | null>(null);

  useEffect(() => {
    subscribeMethods({
      setValue: ({ value }: { value: string }) => {
        setValue(value);
        callbackMap?.onChange?.();
        mergeState({
          value,
        });
      },
    });
  }, [callbackMap, mergeState, setValue, subscribeMethods]);

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
      triggerProps={{
        autoAlignPopupMinWidth,
        autoAlignPopupWidth,
        autoFitPosition,
        autoFixPosition,
        position,
      }}
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
      getPopupContainer={node => {
        return mountToBody ? document.body : node;
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
        <BaseSelect.Option
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          {...(showTitle && { title: o.text || o.value })}
        >
          {o.text || o.value}
        </BaseSelect.Option>
      ))}
    </BaseSelect>
  );
});
