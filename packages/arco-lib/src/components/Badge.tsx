import { Badge as BaseBadge } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { BadgePropsSchema as BaseBadgePropsSchema } from "../generated/types/Badge";

const BadgePropsSchema = Type.Object(BaseBadgePropsSchema);
const BadgeStateSchema = Type.Object({});

const BadgeImpl: ComponentImpl<Static<typeof BadgePropsSchema>> = (props) => {
  const { className, ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements } = props;

  // TODO need to be optimized
  // In arco-design, if `status` and `color` are set, even if `dot` is not set, it will be in dot mode
  // which will cause some confusion and bug
  // If `dot` is not set, delete status and color from props
  if (!cProps.dot) {
    Reflect.deleteProperty(cProps, "status");
    Reflect.deleteProperty(cProps, "color");
  }

  return (
    <BaseBadge className={cx(className, css(customStyle?.content))} {...cProps}>
      {slotsElements.content}
    </BaseBadge>
  );
};
const exampleProperties: Static<typeof BadgePropsSchema> = {
  // TODO handle dotStyle and color
  className: "",
  text: "",
  dot: true,
  count: 1,
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
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Badge = implementRuntimeComponent(options)(BadgeImpl);
