import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { HStack as BaseHStack } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import {
  DirectionSpec,
  FlexWrapSpec,
  AlignItemsSpec,
  JustifyContentSpec,
  SpacingSpec,
} from './Stack';

const PropsSpec = Type.Object({
  direction: DirectionSpec,
  wrap: FlexWrapSpec,
  align: AlignItemsSpec,
  justify: JustifyContentSpec,
  spacing: SpacingSpec,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'hstack',
    description: 'chakra-ui hstack',
    displayName: 'HStack',
    exampleProperties: {
      direction: 'row',
      wrap: 'wrap',
      align: '',
      justify: '',
      spacing: '24px',
    },
    exampleSize: [6, 6],
    isDraggable: true,
    isResizable: true,
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    methods: {},
    events: [],
  },
})(
  ({
    direction,
    wrap,
    align,
    justify,
    spacing,
    slotsElements,
    customStyle,
    elementRef,
  }) => {
    return (
      <BaseHStack
        height="full"
        width="full"
        padding="4"
        background="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="4"
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
        {...{ direction, wrap, align, justify, spacing }}
      >
        {slotsElements.content ? slotsElements.content({}) : null}
      </BaseHStack>
    );
  }
);
