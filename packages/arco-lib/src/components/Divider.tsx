import { Divider as BaseDivider } from "@arco-design/web-react";
import { ComponentImplementation } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { DividerPropsSchema as BaseDividerPropsSchema } from "../generated/types/Divider";

const DividerPropsSchema = Type.Object({
  ...BaseDividerPropsSchema,
  className: Type.Optional(Type.String()),
});
const DividerStateSchema = Type.Object({});

const DividerImpl: ComponentImplementation<
  Static<typeof DividerPropsSchema>
> = (props) => {
  const { customStyle } = props;
  const { className, ...cProps } = getComponentProps(props);

  return (
    <BaseDivider
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    ></BaseDivider>
  );
};

export const Divider = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "divider",
      displayName: "Divider",
    },
    spec: {
      properties: DividerPropsSchema,
      state: DividerStateSchema,
      methods: {},
      slots: [],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: DividerImpl,
};
