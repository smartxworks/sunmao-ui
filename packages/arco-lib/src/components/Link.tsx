import { Link as BaseLink } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { LinkPropsSpec as BaseLinkPropsSpec } from '../generated/types/Link';

const LinkPropsSpec = Type.Object(BaseLinkPropsSpec);
const LinkStateSpec = Type.Object({});

const exampleProperties: Static<typeof LinkPropsSpec> = {
  disabled: false,
  hoverable: true,
  status: 'default',
  href: '#',
  content: 'Link',
  target: '_self',
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
      category: 'Input',
    },
    exampleProperties,
  },
  spec: {
    properties: LinkPropsSpec,
    state: LinkStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { content, status, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle } = props;

  return (
    <BaseLink
      ref={elementRef}
      status={statusMap[status]}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {content}
    </BaseLink>
  );
});
