import { Progress as BaseProgress } from "@arco-design/web-react";
import {
  ComponentImpl,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ProgressPropsSchema as BaseProgressPropsSchema } from "../generated/types/Progress";
import { useState, useEffect } from "react";

const ProgressPropsSchema = Type.Object(BaseProgressPropsSchema);
const ProgressStateSchema = Type.Object({
  percent: Type.String(),
});

const ProgressImpl: ComponentImpl<
  Static<typeof ProgressPropsSchema>
> = (props) => {
  const { className, ...cProps } = getComponentProps(props);
  const {
    mergeState,
    defaultPercent,
    customStyle,
    subscribeMethods,
  } = props;
  const [percent, _setPercent] = useState(defaultPercent);

  useEffect(() => {
    mergeState({percent});
  }, [percent]);

  subscribeMethods({
    setPercent({percent}) {
      _setPercent(percent)
    },
  });

  return (
      <BaseProgress
        percent={percent}
        className={cx(className, css(customStyle?.content))}
        {...cProps}
      />
  );
};
const exampleProperties: Static<typeof ProgressPropsSchema> = {
  className: "",
  type: "line",
  steps: 0,
  animation: true,
  status: "normal",
  color: "red",
  trailColor: "blue",
  showText: true,
  defaultPercent: 0,
  width: 100,
  size: "default",
  buffer: false,
  bufferColor: "",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Progress",
    displayName: "Progress",
    exampleProperties,
  },
  spec: {
    properties: ProgressPropsSchema,
    state: ProgressStateSchema,
    methods: {
      setPercent: Type.String(),
    },
    slots: [],
    styleSlots: ["content"],
    events: ["setPercent"],
  },
};

export const Progress = implementRuntimeComponent(options)(
  ProgressImpl as typeof ProgressImpl & undefined
);
