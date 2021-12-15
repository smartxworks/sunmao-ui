import { Input as BaseInput } from "@arco-design/web-react";
import { ComponentImplementation, Slot } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
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

const InputImpl: ComponentImplementation<Static<typeof InputPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle, callbackMap, mergeState } = props;
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
      addAfter={<Slot slotsMap={slotsMap} slot="addAfter" />}
      addBefore={<Slot slotsMap={slotsMap} slot="addBefore" />}
      prefix={<Slot slotsMap={slotsMap} slot="prefix" />}
      suffix={<Slot slotsMap={slotsMap} slot="suffix" />}
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

export const Input = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "input",
    },
    spec: {
      properties: InputPropsSchema,
      state: InputStateSchema,
      methods: [],
      slots: ["addAfter", "addBefore", "prefix", "suffix"],
      styleSlots: ["input"],
      events: ["onChange", "onBlur", "onFocus"],
    },
  }),
  impl: InputImpl,
};
