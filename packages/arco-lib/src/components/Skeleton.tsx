import { Skeleton as BaseSkeleton } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SkeletonPropsSpec as BaseSkeletonPropsSpec } from '../generated/types/Skeleton';

const SkeletonPropsSpec = Type.Object(BaseSkeletonPropsSpec);
const SkeletonStateSpec = Type.Object({});

const exampleProperties: Static<typeof SkeletonPropsSpec> = {
  animation: true,
  loading: true,
  image: false,
  text: { rows: 3, width: ['100%', 600, 400] },
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'skeleton',
    displayName: 'Skeleton',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: SkeletonPropsSpec,
    state: SkeletonStateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
};

export const Skeleton = implementRuntimeComponent(options)(props => {
  const { ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  return (
    <BaseSkeleton ref={elementRef} className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content ? slotsElements.content({}) : null}
    </BaseSkeleton>
  );
});
