import { Avatar as BaseAvatar } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { AvatarPropsSchema as BaseAvatarPropsSchema } from "../generated/types/Avatar";

const AvatarPropsSchema = Type.Object({
  ...BaseAvatarPropsSchema,
});
const AvatarStateSchema = Type.Object({});

const AvatarImpl: ComponentImpl<Static<typeof AvatarPropsSchema>> = (props) => {
  const { slotsElements, customStyle } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseAvatar>
  );
};

const exampleProperties: Static<typeof AvatarPropsSchema> = {
  shape: "circle",
  autoFixFontSize: false,
  triggerType: "button",
  size:50
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "avatar",
    displayName: "Avatar",
    exampleProperties,
    annotations: {
      category: "Display",
    }
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
