import { Badge as BaseBadge } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { BadgePropsSchema as BaseBadgePropsSchema } from "../generated/types/Badge";
import { useState, useEffect } from "react";

const BadgePropsSchema = Type.Object(BaseBadgePropsSchema);
const BadgeStateSchema = Type.Object({
  count: Type.Number(),
  text: Type.String(),
});

const BadgeImpl: ComponentImpl<Static<typeof BadgePropsSchema>> = (props) => {
  const { className, defaultCount, defaultText, ...cProps } =
    getComponentProps(props);
  const { mergeState, customStyle, subscribeMethods, slotsElements } = props;

  const [count, _setCount] = useState(defaultCount);
  const [text, _setText] = useState(defaultText);

  // TODO
  // arco如果设置status和color，即使不设置dot=true也会是dot模式，这会造成一些迷惑，所以暂时在这里处理一下
  // 如果不设置dot=true，status和color就无效
  if (!cProps.dot) {
    Reflect.deleteProperty(cProps, "status");
    Reflect.deleteProperty(cProps, "color");
  }

  useEffect(() => {
    mergeState({ count });
  }, [count]);

  useEffect(() => {
    mergeState({ text });
  }, [text]);

  useEffect(() => {
    subscribeMethods({
      setCount({ count }) {
        _setCount(count);
      },
      setText({ text }) {
        _setText(text);
      },
    });
  });

  return (
    <BaseBadge
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      count={count}
      text={text}
    >
      {slotsElements.content}
    </BaseBadge>
  );
};
const exampleProperties: Static<typeof BadgePropsSchema> = {
  // TODO handle dotStyle and color
  className: "",
  defaultCount: 2,
  defaultText: "",
  dot: true,
  maxCount: 99,
  offset: [6, -2],
  status: "default",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Badge",
    displayName: "Badge",
    exampleProperties,
  },
  spec: {
    properties: BadgePropsSchema,
    state: BadgeStateSchema,
    methods: {
      setCount: Type.String(),
      setText: Type.String(),
    },
    slots: ["content"],
    styleSlots: ["content"],
    events: [""],
  },
};

export const Badge = implementRuntimeComponent(options)(
  BadgeImpl as typeof BadgeImpl & undefined
);
