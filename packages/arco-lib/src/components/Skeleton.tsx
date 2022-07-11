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
  imageProps: {
    shape: 'square',
    size: 'default',
    position: 'left',
  },
  text: true,
  textProps: { rows: 3, width: ['100%', 600, 400] },
};

export const Skeleton = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'skeleton',
    displayName: 'Skeleton',
    exampleProperties,
    annotations: {
      category: 'Feedback',
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
})(props => {
  const { image, imageProps, text, textProps, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  return (
    <BaseSkeleton
      image={image && imageProps}
      text={text && textProps}
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content ? slotsElements.content({}) : null}
    </BaseSkeleton>
  );
});
