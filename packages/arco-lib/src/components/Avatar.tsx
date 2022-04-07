import { Avatar as BaseAvatar } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { AvatarPropsSpec as BaseAvatarPropsSpec } from "../generated/types/Avatar";

const AvatarPropsSpec = Type.Object({
  ...BaseAvatarPropsSpec,
});
const AvatarStateSpec = Type.Object({});

const AvatarImpl: ComponentImpl<Static<typeof AvatarPropsSpec>> = (props) => {
  const { elementRef, slotsElements, customStyle } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar ref={elementRef} className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseAvatar>
  );
};

const exampleProperties: Static<typeof AvatarPropsSpec> = {
  shape: "circle",
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
    properties: AvatarPropsSpec,
    state: AvatarStateSpec,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Avatar = implementRuntimeComponent(options)(AvatarImpl);
