import { Space as BaseSpace } from "@arco-design/web-react";
import { ComponentImplementation, Slot } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import {
  FALLBACK_METADATA,
  getComponentProps,
  StringUnion,
} from "../sunmao-helper";
import { SpacePropsSchema as BaseSpacePropsSchema } from "../generated/types/Space";

const SpacePropsSchema = Type.Object({
  ...BaseSpacePropsSchema,
  size: Type.Union([
    Type.Optional(StringUnion(["mini", "small", "medium", "large"])),
    Type.Number(),
  ]),
});
const SpaceStateSchema = Type.Object({});

const SpaceImpl: ComponentImplementation<Static<typeof SpacePropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseSpace className={css(customStyle?.content)} {...cProps} size="large">
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseSpace>
  );
};

export const Space = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "space",
      displayName: "Space",
    },
    spec: {
      properties: SpacePropsSchema,
      state: SpaceStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: ["onClick"],
    },
  }),
  impl: SpaceImpl,
};
