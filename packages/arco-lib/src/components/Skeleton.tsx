import { Skeleton as BaseSkeleton, SkeletonTextProps } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { SkeletonPropsSchema as BaseSkeletonPropsSchema } from "../generated/types/Skeleton";

const SkeletonPropsSchema = Type.Object(BaseSkeletonPropsSchema);
const SkeletonStateSchema = Type.Object({});

const SkeletonImpl: ComponentImpl<Static<typeof SkeletonPropsSchema>> = (
  props
) => {
  const { text, ...cProps } = getComponentProps(props);
  const { customStyle, className, slotsElements } = props;
  // TODO: Typebox Static cannot convert SkeletonTextProps to type correctly
  const _text = text as SkeletonTextProps

  return (
    <BaseSkeleton
      className={cx(className, css(customStyle?.content))}
      text={_text}
      {...cProps}
    >
      {slotsElements.content}
    </BaseSkeleton>
  );
};

const exampleProperties: Static<typeof SkeletonPropsSchema> = {
  className: "",
  animation: true,
  loading: true,
  image: false,
  text: { rows: 3, width: ["100%", 600, 400] },
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Skeleton",
    displayName: "Skeleton",
    exampleProperties,
  },
  spec: {
    properties: SkeletonPropsSchema,
    state: SkeletonStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Skeleton = implementRuntimeComponent(options)(SkeletonImpl);
