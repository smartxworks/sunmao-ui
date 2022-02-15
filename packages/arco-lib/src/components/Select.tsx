import { Select as BaseSelect } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { SelectPropsSchema as BaseSelectPropsSchema } from "../generated/types/Select";
import { useEffect, useState } from "react";

const SelectPropsSchema = Type.Object({
  ...BaseSelectPropsSchema,
});
const SelectStateSchema = Type.Object({
  value: Type.String(),
});

const SelectImpl: ComponentImpl<Static<typeof SelectPropsSchema>> = (props) => {
  const {
    elementRef,
    customStyle,
    callbackMap,
    mergeState,
    defaultValue = "",
  } = props;
  const { options = [], ...cProps } = getComponentProps(props);
  const [value, setValue] = useState<string>(defaultValue);
  useEffect(() => {
    mergeState({
      value,
    });
  }, [mergeState, value]);

  return (
    <BaseSelect
      ref={elementRef}
      className={css(customStyle?.content)}
      onChange={(v) => {
        setValue(v);
        callbackMap?.onChange?.();
      }}
      value={value}
      {...cProps}
    >
      {options.map((o) => (
        <BaseSelect.Option key={o.value} value={o.value} disabled={o.disabled}>
          {o.text}
        </BaseSelect.Option>
      ))}
    </BaseSelect>
  );
};

const exampleProperties: Static<typeof SelectPropsSchema> = {
  allowClear: false,
  allowCreate: false,
  animation: false,
  bordered: false,
  defaultActiveFirstOption: false,
  defaultValue: "",
  disabled: false,
  error: false,
  inputValue: "",
  labelInValue: false,
  loading: false,
  mode: "multiple",
  options: [
    { value: "smartx", text: "smartx" },
    { value: "baidu", text: "baidu" },
    { value: "tencent", text: "tencent" },
  ],
  placeholder: "",
  popupVisible: false,
  size: "default",
  unmountOnExit: false,
};

export const Select = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "select",
    displayName: "Select",
    exampleProperties,
    annotations: {
      category: "Input",
    },
  },
  spec: {
    properties: SelectPropsSchema,
    state: SelectStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: ["onChange"],
  },
})(SelectImpl);
