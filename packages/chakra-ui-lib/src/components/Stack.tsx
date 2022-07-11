import { Type } from '@sinclair/typebox';
import { Stack as BaseStack } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { LAYOUT } from './constants/category';

export const DirectionSpec = Type.Union(
  [
    Type.KeyOf(
      Type.Object({
        column: Type.String(),
        'column-reverse': Type.String(),
        row: Type.String(),
        'row-reverse': Type.String(),
      })
    ),
    Type.Array(
      Type.KeyOf(
        Type.Object({
          column: Type.String(),
          'column-reverse': Type.String(),
          row: Type.String(),
          'row-reverse': Type.String(),
        })
      )
    ),
  ],
  {
    title: 'Flex Direction',
    category: LAYOUT,
  }
);
export const FlexWrapSpec = Type.KeyOf(
  Type.Object({
    nowrap: Type.String(),
    wrap: Type.String(),
    'wrap-reverse': Type.String(),
  }),
  {
    title: 'Flex Wrap',
    category: LAYOUT,
  }
);
export const AlignItemsSpec = Type.String({
  title: 'Align Items',
  category: LAYOUT,
});
export const JustifyContentSpec = Type.String({
  title: 'Justify Content',
  category: LAYOUT,
});
export const SpacingSpec = Type.Union([Type.String(), Type.Number()], {
  title: 'Spacing',
  category: LAYOUT,
});

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
    name: 'stack',
    displayName: 'Stack',
    description: 'chakra-ui stack',
    exampleProperties: {
      direction: 'column',
      spacing: 10,
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: [],
    events: [],
  },
})(({ direction, wrap, align, justify, spacing, slotsElements, elementRef }) => {
  return (
    <BaseStack {...{ direction, wrap, align, justify, spacing }} ref={elementRef}>
      {slotsElements.content ? slotsElements.content({}) : null}
    </BaseStack>
  );
});
