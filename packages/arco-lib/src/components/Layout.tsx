import { Layout as BaseLayout } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  HeaderPropsSchema as BaseHeaderPropsSchema,
  FooterPropsSchema as BaseFooterPropsSchema,
  ContentPropsSchema as BaseContentPropsSchema,
  SiderPropsSchema as BaseSiderPropsSchema,
  LayoutPropsSchema as BaseLayoutPropsSchema,
} from "../generated/types/Layout";

const LayoutPropsSchema = Type.Object(BaseLayoutPropsSchema);
const LayoutStateSchema = Type.Object({});

const LayoutImpl: ComponentImpl<Static<typeof LayoutPropsSchema>> = (props) => {
  const { elementRef, slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);
  return (
    <BaseLayout
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content}
    </BaseLayout>
  );
};

export const Layout = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "layout",
    displayName: "Layout",
    exampleProperties: {},
    annotations: {
      category: "Layout",
    },
  },
  spec: {
    properties: LayoutPropsSchema,
    state: LayoutStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(LayoutImpl as typeof LayoutImpl & undefined);

const HeaderPropsSchema = Type.Object(BaseHeaderPropsSchema);
const HeaderStateSchema = Type.Object({});

const HeaderImpl: ComponentImpl<Static<typeof HeaderPropsSchema>> = (props) => {
  const { slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Header className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseLayout.Header>
  );
};

export const Header = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "header",
    displayName: "Header",
    exampleProperties: {},
    annotations: {
      category: "Layout",
    },
  },
  spec: {
    properties: HeaderPropsSchema,
    state: HeaderStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(HeaderImpl as typeof HeaderImpl & undefined);

const FooterPropsSchema = Type.Object(BaseFooterPropsSchema);
const FooterStateSchema = Type.Object({});

const FooterImpl: ComponentImpl<Static<typeof FooterPropsSchema>> = (props) => {
  const { slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Footer className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseLayout.Footer>
  );
};

export const Footer = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "footer",
    displayName: "Footer",
    exampleProperties: {},
    annotations: {
      category: "Layout",
    },
  },
  spec: {
    properties: FooterPropsSchema,
    state: FooterStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(FooterImpl as typeof FooterImpl & undefined);

const ContentPropsSchema = Type.Object(BaseContentPropsSchema);
const ContentStateSchema = Type.Object({});

const ContentImpl: ComponentImpl<Static<typeof ContentPropsSchema>> = (
  props
) => {
  const { slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Content className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseLayout.Content>
  );
};


export const Content = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "content",
    displayName: "Content",
    exampleProperties: {},
    annotations: {
      category: "Layout",
    },
  },
  spec: {
    properties: ContentPropsSchema,
    state: ContentStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(ContentImpl as typeof ContentImpl & undefined);

const SiderPropsSchema = Type.Object(BaseSiderPropsSchema);
const SiderStateSchema = Type.Object({});

const SiderImpl: ComponentImpl<Static<typeof SiderPropsSchema>> = (props) => {
  const { slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Sider className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseLayout.Sider>
  );
};

const sideExampleProperties: Static<typeof SiderPropsSchema> = {
  breakpoint: "xl",
  collapsed: false,
  collapsible: false,
  reverseArrow: false,
  theme: "dark",
  collapsedWidth: 48,
};

export const Sider = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "sider",
    displayName: "Sider",
    exampleProperties: sideExampleProperties,
    annotations: {
      category: "Layout",
    },
  },
  spec: {
    properties: SiderPropsSchema,
    state: SiderStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(SiderImpl);
