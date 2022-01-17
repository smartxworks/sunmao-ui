import { Button as BaseButton } from "@arco-design/web-react";
import {
  ComponentImpl,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ButtonPropsSchema as BaseButtonPropsSchema } from "../generated/types/Button";

const ButtonPropsSchema = Type.Object({
  ...BaseButtonPropsSchema,
  className: Type.Optional(Type.String()),
});
const ButtonStateSchema = Type.Object({});

const ButtonImpl: ComponentImpl<Static<typeof ButtonPropsSchema>> = (
  props
) => {
  const { slotsElements, customStyle, callbackMap } = props;
  const { className, ...cProps } = getComponentProps(props);
  
  return (
    <BaseButton
      className={cx(className, css(customStyle?.content))}
      onClick={callbackMap?.onClick}
      {...cProps}
    >
      {slotsElements.content}
    </BaseButton>
  );
};

const exampleProperties: Static<typeof ButtonPropsSchema> = {
  className: "button",
  htmlType: "button",
  type: "default",
  status: "default",
  long: false,
  size: "default",
  href: "",
  target: "",
  disabled: false,
  loading: false,
  loadingFixedWidth: false,
  iconOnly: false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "button",
    displayName: "Button",
    exampleProperties,
  },
  spec: {
    properties: ButtonPropsSchema,
    state: ButtonStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: ["onClick"],
  },
};

export const Button = implementRuntimeComponent(options)(
  ButtonImpl as typeof ButtonImpl & undefined
);
