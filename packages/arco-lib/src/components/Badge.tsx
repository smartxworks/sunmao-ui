import { Badge as BaseBadge } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { BadgePropsSpec as BaseBadgePropsSpec } from '../generated/types/Badge';

const BadgePropsSpec = Type.Object(BaseBadgePropsSpec);
const BadgeStateSpec = Type.Object({});

const exampleProperties: Static<typeof BadgePropsSpec> = {
  text: '',
  dot: true,
  count: 1,
  maxCount: 99,
  offset: [6, -2],
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'badge',
    displayName: 'Badge',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: BadgePropsSpec,
    state: BadgeStateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
};

export const Badge = implementRuntimeComponent(options)(props => {
  const { ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  // TODO need to be optimized
  // In arco-design, if `status` and `color` are set, even if `dot` is not set, it will be in dot mode
  // which will cause some confusion and bug
  // If `dot` is not set, delete status and color from props
  if (!cProps.dot) {
    Reflect.deleteProperty(cProps, 'status');
    Reflect.deleteProperty(cProps, 'dotColor');
  }

  return (
    <BaseBadge
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      color={cProps.dotColor}
    >
      {slotsElements.content ? <slotsElements.content /> : null}
    </BaseBadge>
  );
});
