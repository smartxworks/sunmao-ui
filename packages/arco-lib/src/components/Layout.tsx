import { Layout as BaseLayout } from "@arco-design/web-react";
import { implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";

const LayoutStateSchema = Type.Object({});

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
    properties: Type.Object({
      showSideBar: Type.Boolean({
        title: "Show Sidebar",
        category: "Basic",
      }),
      siderbarCollapsible: Type.Boolean({
        title: "Sidebar Collapsible",
        category: "Basic",
      }),
      siderbarDefaultCollapsed: Type.Boolean({
        title: "Sidebar Default Collapsed",
        category: "Basic",
      }),
      showFooter: Type.Boolean({
        title: "Show Footer Area",
        category: "Basic",
      }),
    }),
    state: LayoutStateSchema,
    methods: {},
    slots: ["header", "content", "sidebar", "footer"],
    styleSlots: ["layout", "header", "content", "sidebar", "footer"],
    events: [],
  },
})((props) => {
  const { elementRef, slotsElements, customStyle } = props;
  const {
    showSideBar,
    showFooter,
    siderbarCollapsible,
    siderbarDefaultCollapsed,
  } = getComponentProps(props);
  const baseProps = {
    ref: elementRef,
    style: {
      height: "400px",
    },
    className: css`
      height: 400px;
      ${customStyle?.layout || ""}
    `,
  };
  const headerProps = {
    className: css`
      height: 64px;
      background-color: rgb(var(--gray-8));
      ${customStyle?.header || ""}
    `,
  };
  const contentProps = {
    className: css`
      background-color: rgb(var(--gray-1));
      ${customStyle?.content || ""}
    `,
  };
  const siderProps = {
    className: css`
      && {
        background: rgb(var(--gray-5));
        ${customStyle?.sidebar || ""}
      }
    `,
    collapsible: siderbarCollapsible,
    defaultCollapsed: siderbarDefaultCollapsed,
  };
  const footerProps = {
    className: css`
      height: 64px;
      background-color: rgb(var(--gray-8));
      ${customStyle?.footer || ""}
    `,
  };

  return (
    <BaseLayout {...baseProps}>
      <BaseLayout.Header {...headerProps}>
        {slotsElements.header}
      </BaseLayout.Header>
      <BaseLayout>
        {showSideBar && (
          <BaseLayout.Sider {...siderProps}>
            {slotsElements.sidebar}
          </BaseLayout.Sider>
        )}
        <BaseLayout.Content {...contentProps}>
          {slotsElements.content}
        </BaseLayout.Content>
      </BaseLayout>
      {showFooter && (
        <BaseLayout.Footer {...footerProps}>
          {slotsElements.footer}
        </BaseLayout.Footer>
      )}
    </BaseLayout>
  );
});
