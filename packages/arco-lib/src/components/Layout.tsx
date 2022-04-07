import { Layout as BaseLayout } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';

const LayoutStateSpec = Type.Object({});

export const Layout = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'layout',
    displayName: 'Layout',
    exampleProperties: {
      showHeader: true,
      showSideBar: true,
      sidebarCollapsible: false,
      sidebarDefaultCollapsed: false,
      showFooter: true,
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: Type.Object({
      showHeader: Type.Boolean({
        title: 'Show Header',
        category: 'Basic',
      }),
      showFooter: Type.Boolean({
        title: 'Show Footer Area',
        category: 'Basic',
      }),
      showSideBar: Type.Boolean({
        title: 'Show Sidebar',
        category: 'Basic',
      }),
      sidebarCollapsible: Type.Boolean({
        title: 'Sidebar Collapsible',
        category: 'Basic',
      }),
      sidebarDefaultCollapsed: Type.Boolean({
        title: 'Sidebar Default Collapsed',
        category: 'Basic',
      }),
    }),
    state: LayoutStateSpec,
    methods: {},
    slots: ['header', 'content', 'sidebar', 'footer'],
    styleSlots: ['layout', 'header', 'content', 'sidebar', 'footer'],
    events: [],
  },
})(props => {
  const { elementRef, slotsElements, customStyle } = props;
  const {
    showSideBar,
    showFooter,
    showHeader,
    sidebarCollapsible,
    sidebarDefaultCollapsed,
  } = getComponentProps(props);
  const baseProps = {
    ref: elementRef,
    className: css`
      min-height: 400px;
      border: 1px solid #eee;
      ${customStyle?.layout || ''}
    `,
  };
  const headerProps = {
    className: css`
      min-height: 64px;
      border-bottom: 1px solid #eee;
      ${customStyle?.header || ''}
    `,
  };
  const contentProps = {
    className: css`
      ${customStyle?.content || ''}
    `,
  };
  const siderProps = {
    className: css`
      ${customStyle?.sidebar || ''}
    `,
    collapsible: sidebarCollapsible,
    defaultCollapsed: sidebarDefaultCollapsed,
  };
  const footerProps = {
    className: css`
      min-height: 64px;
      border-top: 1px solid #eee;
      ${customStyle?.footer || ''}
    `,
  };

  return (
    <BaseLayout {...baseProps}>
      {showHeader && (
        <BaseLayout.Header {...headerProps}>{slotsElements.header}</BaseLayout.Header>
      )}
      <BaseLayout>
        {showSideBar && (
          <BaseLayout.Sider {...siderProps}>{slotsElements.sidebar}</BaseLayout.Sider>
        )}
        <BaseLayout.Content {...contentProps}>{slotsElements.content}</BaseLayout.Content>
      </BaseLayout>
      {showFooter && (
        <BaseLayout.Footer {...footerProps}>{slotsElements.footer}</BaseLayout.Footer>
      )}
    </BaseLayout>
  );
});
