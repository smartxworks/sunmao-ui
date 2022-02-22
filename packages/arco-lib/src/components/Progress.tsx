import { Progress as BaseProgress } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ProgressPropsSchema as BaseProgressPropsSchema } from "../generated/types/Progress";

const ProgressPropsSchema = Type.Object(BaseProgressPropsSchema);
const ProgressStateSchema = Type.Object({});

const ProgressImpl: ComponentImpl<Static<typeof ProgressPropsSchema>> = (
  props
) => {
  const { elementRef, ...cProps } = getComponentProps(props);
  const { customStyle } = props;

  return (
    <BaseProgress
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
};
const exampleProperties: Static<typeof ProgressPropsSchema> = {
  type: "line",
  status: "normal",
  color: "#3c92dc",
  trailColor: "",
  showText: true,
  percent: 20,
  width: 100,
  size: "default",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "progress",
    displayName: "Progress",
    exampleProperties,
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: ProgressPropsSchema,
    state: ProgressStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};

export const Progress = implementRuntimeComponent(options)(ProgressImpl);
