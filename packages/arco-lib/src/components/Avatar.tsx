import { Avatar as BaseAvatar } from "@arco-design/web-react";
import { ComponentImplementation, Slot } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { AvatarPropsSchema as BaseAvatarPropsSchema } from "../generated/types/Avatar";

const AvatarPropsSchema = Type.Object({
  ...BaseAvatarPropsSchema,
  className: Type.Optional(Type.String()),
});
const AvatarStateSchema = Type.Object({});

const AvatarImpl: ComponentImplementation<Static<typeof AvatarPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const { className, ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseAvatar>
  );
};

export const Avatar = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "avatar",
      displayName: "Avatar",
    },
    spec: {
      properties: AvatarPropsSchema,
      state: AvatarStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: AvatarImpl,
};
