import { Skeleton as BaseSkeleton } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { SkeletonPropsSpec as BaseSkeletonPropsSpec } from "../generated/types/Skeleton";

const SkeletonPropsSpec = Type.Object(BaseSkeletonPropsSpec);
const SkeletonStateSpec = Type.Object({});

const SkeletonImpl: ComponentImpl<Static<typeof SkeletonPropsSpec>> = (
  props
) => {
  const { elementRef, ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements } = props;

  return (
    <BaseSkeleton
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content}
    </BaseSkeleton>
  );
};

const exampleProperties: Static<typeof SkeletonPropsSpec> = {
  animation: true,
  loading: true,
  image: false,
  text: { rows: 3, width: ["100%", 600, 400] },
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "skeleton",
    displayName: "Skeleton",
    exampleProperties,
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: SkeletonPropsSpec,
    state: SkeletonStateSpec,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Skeleton = implementRuntimeComponent(options)(SkeletonImpl);
