import { Layout as BaseLayout } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import {
  FALLBACK_METADATA,
  getComponentProps,
} from "../sunmao-helper";
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
  const { slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseLayout className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content}
    </BaseLayout>
  );
};
const layoutExampleProperties: Static<typeof LayoutPropsSchema> = {
  about: "",
  accessKey: "",
  autoCapitalize: "",
  autoCorrect: "",
  autoSave: "",
  color: "",
  contextMenu: "",
  datatype: "",
  defaultChecked: false,
  dir: "",
  hasSider: false,
  hidden: false,
  id: "",
  inputMode: "text",
  is: "",
  itemID: "",
  itemProp: "",
  itemRef: "",
  itemScope: false,
  itemType: "",
  lang: "",
  placeholder: "",
  prefix: "",
  property: "",
  radioGroup: "",
  resource: "",
  security: "",
  slot: "",
  suppressContentEditableWarning: false,
  suppressHydrationWarning: false,
  title: "",
  translate: "yes",
  typeof: "",
  unselectable: "on",
  vocab: "",
};

export const Layout = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "layout",
    displayName: "Layout",
    exampleProperties: layoutExampleProperties,
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
const headerExampleProperties: Static<typeof HeaderPropsSchema> = {
  about: "",
  accessKey: "",
  autoCapitalize: "",
  autoCorrect: "",
  autoSave: "",
  color: "",
  contextMenu: "",
  datatype: "",
  defaultChecked: false,
  dir: "",
  hidden: false,
  id: "",
  inputMode: "text",
  is: "",
  itemID: "",
  itemProp: "",
  itemRef: "",
  itemScope: false,
  itemType: "",
  lang: "",
  placeholder: "",
  prefix: "",
  property: "",
  radioGroup: "",
  resource: "",
  security: "",
  slot: "",
  suppressContentEditableWarning: false,
  suppressHydrationWarning: false,
  title: "",
  translate: "yes",
  typeof: "",
  unselectable: "on",
  vocab: "",
};

export const Header = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "header",
    displayName: "Header",
    exampleProperties: headerExampleProperties,
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

const footerExampleProperties = {
  defaultChecked: false,
  suppressContentEditableWarning: false,
  suppressHydrationWarning: false,
  accessKey: "",
  contextMenu: "",
  dir: "",
  hidden: false,
  id: "",
  lang: "",
  placeholder: "",
  slot: "",
  title: "",
  translate: "yes",
  radioGroup: "",
  about: "",
  datatype: "",
  prefix: "",
  property: "",
  resource: "",
  typeof: "",
  vocab: "",
  autoCapitalize: "",
  autoCorrect: "",
  autoSave: "",
  color: "",
  itemProp: "",
  itemScope: false,
  itemType: "",
  itemID: "",
  itemRef: "",
  security: "",
  unselectable: "on",
  inputMode: "text",
  is: "",
};

export const Footer = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "footer",
    displayName: "Footer",
    exampleProperties: footerExampleProperties,
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

const contentExampleProperties = {
  defaultChecked: false,
  suppressContentEditableWarning: false,
  suppressHydrationWarning: false,
  accessKey: "",
  contextMenu: "",
  dir: "",
  hidden: false,
  id: "",
  lang: "",
  placeholder: "",
  slot: "",
  title: "",
  translate: "yes",
  radioGroup: "",
  about: "",
  datatype: "",
  prefix: "",
  property: "",
  resource: "",
  typeof: "",
  vocab: "",
  autoCapitalize: "",
  autoCorrect: "",
  autoSave: "",
  color: "",
  itemProp: "",
  itemScope: false,
  itemType: "",
  itemID: "",
  itemRef: "",
  security: "",
  unselectable: "on",
  inputMode: "text",
  is: "",
};

export const Content = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "content",
    displayName: "Content",
    exampleProperties: contentExampleProperties,
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
  defaultCollapsed: false,
  reverseArrow: false,
  theme: "dark",
};

export const Sider = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "sider",
    displayName: "Sider",
    exampleProperties: sideExampleProperties,
  },
  spec: {
    properties: SiderPropsSchema,
    state: SiderStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
})(SiderImpl as typeof SiderImpl & undefined);
