import { Alert as BaseAlert } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { AlertPropsSchema as BaseAlertPropsSchema } from "../generated/types/Alert";

const AlertPropsSchema = Type.Object(BaseAlertPropsSchema);
const AlertStateSchema = Type.Object({});

const AlertImpl: ComponentImpl<Static<typeof AlertPropsSchema>> = (props) => {
  const { visible, content, title, ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements } = props;

  return visible ? (
    <BaseAlert
      action={slotsElements.action}
      icon={slotsElements.icon}
      content={
        <>
          {content}
          {slotsElements.content}
        </>
      }
      title={
        <>
          {title}
          {slotsElements.title}
        </>
      }
      className={css(customStyle?.content)}
      {...cProps}
    />
  ) : null;
};

const exampleProperties: Static<typeof AlertPropsSchema> = {
  disabled: false,
  closable: true,
  title: "info",
  content: "Here is an example text",
  visible: "true",
  showIcon: true,
  banner: false,
  type: "info",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "alert",
    displayName: "Alert",
    exampleProperties,
  },
  spec: {
    properties: AlertPropsSchema,
    state: AlertStateSchema,
    methods: {},
    slots: ["content", "action", "icon", "title"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Alert = implementRuntimeComponent(options)(AlertImpl);
