import { Input } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TextAreaPropsSchema as BaseTextAreaPropsSchema } from "../generated/types/TextArea";
import { useEffect, useState, useRef } from "react";
import { RefInputType } from "@arco-design/web-react/es/Input/interface";

const TextAreaPropsSchema = Type.Object({
  ...BaseTextAreaPropsSchema,
});
const TextAreaStateSchema = Type.Object({
  value: Type.String(),
});

const BaseTextArea = Input.TextArea;

const TextAreaImpl: ComponentImpl<Static<typeof TextAreaPropsSchema>> = (
  props
) => {
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

  useEffect(() => {
    mergeState({
      value,
    });
  }, [value]);

  return (
    <BaseTextArea
      ref={ref}
      className={css(customStyle?.TextArea)}
      value={value}
      onChange={(value) => {
        setValue(value);
        callbackMap?.onChange?.();
      }}
      {...cProps}
    />
  );
};

const exampleProperties: Static<typeof TextAreaPropsSchema> = {
  allowClear: false,
  disabled: false,
  defaultValue: "",
  placeholder: "please input",
  error: false,
  size: "default",
  autoSize: true,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "textArea",
    displayName: "TextArea",
    exampleProperties,
    annotations: {
      category: "TextArea",
    },
  },
  spec: {
    properties: TextAreaPropsSchema,
    state: TextAreaStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["TextArea"],
    events: ["onChange"],
  },
};

export const TextArea = implementRuntimeComponent(options)(TextAreaImpl);
