import { Mentions as BaseMentions } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { MentionsPropsSchema as BaseMentionsPropsSchema } from "../generated/types/Mentions";
import { useState, useEffect } from "react";

const MentionsPropsSchema = Type.Object(BaseMentionsPropsSchema);
const MentionsStateSchema = Type.Object({
  value: Type.String(),
});

const MentionsImpl: ComponentImpl<Static<typeof MentionsPropsSchema>> = (
  props
) => {
  const { elementRef, defaultValue, ...cProps } = getComponentProps(props);
  const { mergeState, customStyle, callbackMap } = props;

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  const onChange = (value: string) => {
    setValue(value);
    callbackMap?.onChange?.();
  };

  const onClear = () => {
    callbackMap?.onClear?.();
  };

  const onPressEnter = () => {
    // TODO complete onPressEnter methods
    callbackMap?.onPressEnter?.();
  };

  return (
    <BaseMentions
    ref={elementRef}
      onPressEnter={onPressEnter}
      onClear={onClear}
      className={css(customStyle?.content)}
      onChange={onChange}
      {...cProps}
      value={value}
    />
  );
};
const exampleProperties: Static<typeof MentionsPropsSchema> = {
  defaultValue: "smartx",
  options: ["smartx", "byte and dance", "baidu"],
  prefix: "@",
  position: "bl",
  split: " ",
  error: false,
  allowClear: true,
  disabled: false,
  placeholder: 'you can mentions sb by prefix "@"',
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "mentions",
    displayName: "Mentions",
    exampleProperties,
  },
  spec: {
    properties: MentionsPropsSchema,
    state: MentionsStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: ["onChange", "onClear", "onPressEnter"],
  },
};

export const Mentions = implementRuntimeComponent(options)(MentionsImpl);
