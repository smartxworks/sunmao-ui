import { Link as BaseLink } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { LinkPropsSpec as BaseLinkPropsSpec } from '../generated/types/Link';

const LinkPropsSpec = Type.Object(BaseLinkPropsSpec);
const LinkStateSpec = Type.Object({});

const exampleProperties: Static<typeof LinkPropsSpec> = {
  asLink: true,
  disabled: false,
  hoverable: true,
  status: 'default',
  href: '#',
  content: 'Link',
  openInNewPage: false,
};

const statusMap = {
  default: undefined,
  success: 'success',
  error: 'error',
  warning: 'warning',
} as const;

export const Link = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'link',
    displayName: 'Link',
    annotations: {
      category: 'General',
    },
    exampleProperties,
  },
  spec: {
    properties: LinkPropsSpec,
    state: LinkStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({}),
      },
      icon: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(props => {
  const { asLink, content, status, openInNewPage, href, ...cProps } =
    getComponentProps(props);
  const { elementRef, customStyle, slotsElements, callbackMap } = props;

  return (
    <BaseLink
      ref={elementRef}
      status={statusMap[status]}
      className={css(customStyle?.content)}
      icon={slotsElements.icon?.({})}
      onClick={() => {
        callbackMap?.onClick?.();
      }}
      {...cProps}
      {...(asLink && {
        target: openInNewPage ? '_blank' : '_self',
        href,
      })}
    >
      {slotsElements.content ? slotsElements.content({}) : content}
    </BaseLink>
  );
});
