import { Avatar as BaseAvatar } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { AvatarPropsSchema as BaseAvatarPropsSchema } from "../generated/types/Avatar";

const AvatarPropsSchema = Type.Object({
  ...BaseAvatarPropsSchema,
  className: Type.Optional(Type.String()),
});
const AvatarStateSchema = Type.Object({});

const AvatarImpl: ComponentImpl<Static<typeof AvatarPropsSchema>> = (props) => {
  const { slotsElements, customStyle } = props;
  const { className, ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      {slotsElements.content}
    </BaseAvatar>
  );
};

const exampleProperties: Static<typeof AvatarPropsSchema> = {
  className: "avatar",
  shape: "circle",
  autoFixFontSize: false,
  triggerType: "button",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "avatar",
    displayName: "Avatar",
    exampleProperties,
  },
  spec: {
    properties: AvatarPropsSchema,
    state: AvatarStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Avatar = implementRuntimeComponent(options)(AvatarImpl);
