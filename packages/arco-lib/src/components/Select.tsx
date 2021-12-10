import { Select as BaseSelect } from "@arco-design/web-react";
import { ComponentImplementation } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { SelectPropsSchema as BaseSelectPropsSchema } from "../generated/types/Select";
import { useEffect, useState } from "react";

const SelectPropsSchema = Type.Object({
  ...BaseSelectPropsSchema,
  options: Type.Optional(
    Type.Array(
      Type.Object({
        value: Type.String(),
        text: Type.String(),
        disabled: Type.Optional(Type.Boolean()),
      })
    )
  ),
  defaultValue: Type.Optional(Type.String()),
});
const SelectStateSchema = Type.Object({
  value: Type.String(),
});

const SelectImpl: ComponentImplementation<Static<typeof SelectPropsSchema>> = (
  props
) => {
  const { customStyle, callbackMap, mergeState, defaultValue = "" } = props;
  const { options = [], ...cProps } = getComponentProps(props);
  const [value, setValue] = useState<string>(defaultValue);
  useEffect(() => {
    mergeState({
      value,
    });
  }, [value]);

  return (
    <BaseSelect
      className={css(customStyle?.content)}
      onChange={(v) => {
        setValue(v);
        callbackMap?.onChange();
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

export const Select = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "select",
    },
    spec: {
      properties: SelectPropsSchema,
      state: SelectStateSchema,
      methods: [],
      slots: [],
      styleSlots: ["content"],
      events: ["onChange"],
    },
  }),
  impl: SelectImpl,
};
