import { Layout as BaseLayout } from "@arco-design/web-react";
import { ComponentImplementation, Slot } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
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

const LayoutImpl: ComponentImplementation<Static<typeof LayoutPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout className={css(customStyle?.content)} {...cProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseLayout>
  );
};

export const Layout = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "layout",
      displayName: "Layout",
    },
    spec: {
      properties: LayoutPropsSchema,
      state: LayoutStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: LayoutImpl,
};

const HeaderPropsSchema = Type.Object(BaseHeaderPropsSchema);
const HeaderStateSchema = Type.Object({});

const HeaderImpl: ComponentImplementation<Static<typeof HeaderPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Header className={css(customStyle?.content)} {...cProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseLayout.Header>
  );
};

export const Header = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "header",
      displayName: "Header",
    },
    spec: {
      properties: HeaderPropsSchema,
      state: HeaderStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: HeaderImpl,
};

const FooterPropsSchema = Type.Object(BaseFooterPropsSchema);
const FooterStateSchema = Type.Object({});

const FooterImpl: ComponentImplementation<Static<typeof FooterPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Footer className={css(customStyle?.content)} {...cProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseLayout.Footer>
  );
};

export const Footer = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "footer",
      displayName: "Footer",
    },
    spec: {
      properties: FooterPropsSchema,
      state: FooterStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: FooterImpl,
};

const ContentPropsSchema = Type.Object(BaseContentPropsSchema);
const ContentStateSchema = Type.Object({});

const ContentImpl: ComponentImplementation<
  Static<typeof ContentPropsSchema>
> = (props) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Content className={css(customStyle?.content)} {...cProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseLayout.Content>
  );
};

export const Content = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "content",
      displayName: "Content",
    },
    spec: {
      properties: ContentPropsSchema,
      state: ContentStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: ContentImpl,
};

const SiderPropsSchema = Type.Object(BaseSiderPropsSchema);
const SiderStateSchema = Type.Object({});

const SiderImpl: ComponentImplementation<Static<typeof SiderPropsSchema>> = (
  props
) => {
  const { slotsMap, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout.Sider className={css(customStyle?.content)} {...cProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseLayout.Sider>
  );
};

export const Sider = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "sider",
      displayName: "Sider",
    },
    spec: {
      properties: SiderPropsSchema,
      state: SiderStateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: SiderImpl,
};
