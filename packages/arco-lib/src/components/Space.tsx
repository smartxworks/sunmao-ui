import { Space as BaseSpace } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SpacePropsSpec as BaseSpacePropsSpec } from '../generated/types/Space';
import { EmptyPlaceholder } from './_internal/EmptyPlaceholder';

const SpacePropsSpec = Type.Object({
  ...BaseSpacePropsSpec,
});
const SpaceStateSpec = Type.Object({});

const exampleProperties: Static<typeof SpacePropsSpec> = {
  align: 'center',
  direction: 'vertical',
  wrap: false,
  size: 24,
};
export const Space = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    annotations: {
      category: 'Layout',
    },
    name: 'space',
    displayName: 'Space',
  },
  spec: {
    properties: SpacePropsSpec,
    state: SpaceStateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(props => {
  const { elementRef, slotsElements, customStyle } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseSpace ref={elementRef} className={css(customStyle?.content)} {...cProps}>
      {slotsElements.content ? slotsElements.content({}) : <EmptyPlaceholder />}
    </BaseSpace>
  );
});
