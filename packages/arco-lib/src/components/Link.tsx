import { Link as BaseLink } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { LinkPropsSchema as BaseLinkPropsSchema } from "../generated/types/Link";

const LinkPropsSchema = Type.Object(BaseLinkPropsSchema);
const LinkStateSchema = Type.Object({});

const LinkImpl: ComponentImpl<Static<typeof LinkPropsSchema>> = (props) => {
  const { content, status, ...cProps } = getComponentProps(props);
  const { customStyle, className, slotsElements } = props;

  return (
    <BaseLink
      status={status}
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      {content}
      {slotsElements.content}
    </BaseLink>
  );
};

const exampleProperties: Static<typeof LinkPropsSchema> = {
  className: "",
  disabled: false,
  hoverable: true,
  status: "warning",
  href: "https://www.smartx.com/",
  content: "Link",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "link",
    displayName: "Link",
    exampleProperties,
  },
  spec: {
    properties: LinkPropsSchema,
    state: LinkStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Link = implementRuntimeComponent(options)(LinkImpl);
