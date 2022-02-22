import { Link as BaseLink } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { LinkPropsSchema as BaseLinkPropsSchema } from "../generated/types/Link";

const LinkPropsSchema = Type.Object(BaseLinkPropsSchema);
const LinkStateSchema = Type.Object({});

const LinkImpl: ComponentImpl<Static<typeof LinkPropsSchema>> = (props) => {
  const { elementRef, content, status, ...cProps } = getComponentProps(props);
  const { customStyle } = props;

  return (
    <BaseLink
      ref={elementRef}
      status={status}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {content}
    </BaseLink>
  );
};

const exampleProperties: Static<typeof LinkPropsSchema> = {
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
    annotations: {
      category: "Input",
    },
    exampleProperties,
  },
  spec: {
    properties: LinkPropsSchema,
    state: LinkStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};

export const Link = implementRuntimeComponent(options)(LinkImpl);
