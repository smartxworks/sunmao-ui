import { Link as BaseLink } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { LinkPropsSpec as BaseLinkPropsSpec } from '../generated/types/Link';
import { useCallback } from 'react';

const LinkPropsSpec = Type.Object(BaseLinkPropsSpec);
const LinkStateSpec = Type.Object({});

const exampleProperties: Static<typeof LinkPropsSpec> = {
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
    },
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(props => {
  const { content, status, openInNewPage, href, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements, callbackMap } = props;

  const handleClick = useCallback(
    event => {
      if (!href) {
        event.preventDefault();
        event.stopPropagation();
      }
      callbackMap?.onClick?.();
    },
    [callbackMap, href]
  );

  return (
    <BaseLink
      ref={elementRef}
      status={statusMap[status]}
      href={href}
      className={css(customStyle?.content)}
      onClick={handleClick}
      {...cProps}
      target={openInNewPage ? '_blank' : '_self'}
    >
      {slotsElements.content ? slotsElements.content({}) : content}
    </BaseLink>
  );
});
