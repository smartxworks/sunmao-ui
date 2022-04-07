import { Space as BaseSpace } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import {
  FALLBACK_METADATA,
  getComponentProps,
} from "../sunmao-helper";
import { SpacePropsSpec as BaseSpacePropsSpec } from "../generated/types/Space";

const SpacePropsSpec = Type.Object({
  ...BaseSpacePropsSpec,
});
const SpaceStateSpec = Type.Object({});

const SpaceImpl: ComponentImpl<Static<typeof SpacePropsSpec>> = (props) => {
  const { elementRef, slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseSpace ref={elementRef} className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseSpace>
  );
};

const exampleProperties: Static<typeof SpacePropsSpec> = {
  align: "center",
  direction: "vertical",
  wrap: false,
  size: "large",
};
export const Space = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    annotations: {
      category: "Layout",
    },
    name: "space",
    displayName: "Space",
  },
  spec: {
    properties: SpacePropsSpec,
    state: SpaceStateSpec,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: ["onClick"],
  },
})(SpaceImpl);
