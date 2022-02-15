import { Button as BaseButton } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ButtonPropsSchema as BaseButtonPropsSchema } from "../generated/types/Button";

const ButtonPropsSchema = Type.Object({
  ...BaseButtonPropsSchema
});
const ButtonStateSchema = Type.Object({});

const ButtonImpl: ComponentImpl<Static<typeof ButtonPropsSchema>> = (props) => {
  const { slotsElements, customStyle, text, callbackMap } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <BaseButton
      className={css(customStyle?.content)}
      onClick={callbackMap?.onClick}
      {...cProps}
    >
      {slotsElements.content}
      {text}
    </BaseButton>
  );
};

const exampleProperties: Static<typeof ButtonPropsSchema> = {
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
  shape: "square",
  text: "button",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "button",
    displayName: "Button",
    exampleProperties,
    annotations: {
      category: "Input",
    }
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

export const Button = implementRuntimeComponent(options)(ButtonImpl);
