import { Switch as BaseSwitch } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { SwitchPropsSchema as BaseSwitchPropsSchema } from "../generated/types/Switch";
import { useEffect, useState } from "react";

const SwitchPropsSchema = Type.Object({
  ...BaseSwitchPropsSchema,
});
const SwitchStateSchema = Type.Object({
  value: Type.Boolean(),
});

const SwitchImpl: ComponentImpl<Static<typeof SwitchPropsSchema>> = (props) => {
  const {elementRef, customStyle, mergeState } = props;
  const { defaultChecked, ...cProps } = getComponentProps(props);
  const [value, setValue] = useState<boolean>(defaultChecked);

  useEffect(() => {
    mergeState({
      value,
    });
  }, [value, mergeState]);

  useEffect(() => {
    setValue(defaultChecked);
  }, [defaultChecked]);

  return (
    <BaseSwitch
      ref={elementRef}
      className={css(customStyle?.content)}
      checked={value}
      {...cProps}
      onChange={(value) => setValue(value)}
    />
  );
};

const exampleProperties: Static<typeof SwitchPropsSchema> = {
  defaultChecked: false,
  disabled: false,
  loading: false,
  type: "circle",
  size: "default",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "switch",
    displayName: "Switch",
    exampleProperties,
    annotations: {
      category: "Input",
    },
  },
  spec: {
    properties: SwitchPropsSchema,
    state: SwitchStateSchema,
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
};

export const Switch = implementRuntimeComponent(options)(SwitchImpl);
