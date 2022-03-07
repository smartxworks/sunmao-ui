import { Input } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { PasswordInputPropsSchema as BasePasswordInputPropsSchema } from "../generated/types/PasswordInput";
import { useEffect, useState, useRef } from "react";
import { RefInputType } from "@arco-design/web-react/es/Input/interface";

const InputPropsSchema = Type.Object({
  ...BasePasswordInputPropsSchema,
});
const InputStateSchema = Type.Object({
  value: Type.String(),
});

const BasePasswordInput = Input.Password;

const PasswordInputImpl: ComponentImpl<Static<typeof InputPropsSchema>> = (
  props
) => {
  const { getElement,customStyle, callbackMap, mergeState } = props;
  const { ...cProps } = getComponentProps(props);
  const [value, setValue] = useState("");
  const ref = useRef<RefInputType | null>(null);

  useEffect(() => {
    mergeState({
      value,
    });
  }, [value]);

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
      onChange={(value) => {
        setValue(value);
        callbackMap?.onChange?.();
      }}
      {...cProps}
    />
  );
};

const exampleProperties: Static<typeof InputPropsSchema> = {
  disabled: false,
  placeholder: "please input",
  error: false,
  size: "default",
  visibilityToggle: true,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "passwordInput",
    displayName: "Password Input",
    exampleProperties,
    annotations: {
      category: "Input",
    },
  },
  spec: {
    properties: InputPropsSchema,
    state: InputStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["input"],
    events: ["onChange"],
  },
};

export const PasswordInput =
  implementRuntimeComponent(options)(PasswordInputImpl);
