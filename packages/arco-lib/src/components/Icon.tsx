import * as Icons from "@arco-design/web-react/icon";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA } from "../sunmao-helper";

const IconPropsSchema = Type.Object({
  name: Type.KeyOf(Type.Object(Icons as Record<keyof typeof Icons, any>)),
  spin: Type.Boolean(),
});

const impl: ComponentImpl<Static<typeof IconPropsSchema>> = (props) => {
  const { elementRef, name, spin, customStyle } = props;
  const _Icon = Icons[name];

  return (
    <_Icon
      ref={elementRef}
      className={cx(css(customStyle?.content))}
      spin={spin}
    />
  );
};

export const Icon = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "icon",
    displayName: "Icon",
    exampleProperties: {
      name: "IconArrowUp",
      spin: false,
    },
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: IconPropsSchema,
    state: Type.Object({}),
    methods: {},
    slots: ["slot"],
    styleSlots: ["content"],
    events: ["event"],
  },
})(impl);
