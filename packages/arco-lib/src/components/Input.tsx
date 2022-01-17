import { Input as BaseInput } from "@arco-design/web-react";
import {
  ComponentImpl,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { InputPropsSchema as BaseInputPropsSchema } from "../generated/types/Input";
import { useEffect, useState } from "react";

const InputPropsSchema = Type.Object({
  ...BaseInputPropsSchema,
  className: Type.Optional(Type.String()),
});
const InputStateSchema = Type.Object({
  value: Type.String(),
});

const InputImpl: ComponentImpl<Static<typeof InputPropsSchema>> = (
  props
) => {
  const { slotsElements, customStyle, callbackMap, mergeState } = props;
  const { className, defaultValue, ...cProps } = getComponentProps(props);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({
      value,
    });
  }, [value]);

  return (
    <BaseInput
      className={cx(className, css(customStyle?.input))}
      addAfter={slotsElements.addAfter}
      addBefore={slotsElements.addBefore}
      prefix={slotsElements.prefix}
      suffix={slotsElements.suffix}
      value={value}
      onChange={(value) => {
        setValue(value);
        callbackMap?.onChange();
      }}
      onBlur={() => callbackMap?.onBlur()}
      onFocus={() => callbackMap?.onFocus()}
      {...cProps}
    />
  );
};

const exampleProperties: Static<typeof InputPropsSchema> = {
  className: "",
  allowClear: false,
  disabled: false,
  readOnly: false,
  defaultValue: "",
  placeholder: "please input",
  error: false,
  size: "default",
  showWordLimit: false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "input",
    displayName: "Input",
    exampleProperties,
  },
  spec: {
    properties: InputPropsSchema,
    state: InputStateSchema,
    methods: {},
    slots: ["addAfter", "addBefore", "prefix", "suffix"],
    styleSlots: ["input"],
    events: ["onChange", "onBlur", "onFocus"],
  },
};

export const Input = implementRuntimeComponent(options)(
  InputImpl as typeof InputImpl & undefined
);
