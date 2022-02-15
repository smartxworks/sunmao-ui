import { Type } from '@sinclair/typebox';
import { Stack as BaseStack } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { LAYOUT } from './constants/category';

export const DirectionSchema = Type.Optional(
  Type.Union(
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
  )
);
export const FlexWrapSchema = Type.KeyOf(
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
export const AlignItemsSchema = Type.String({
  title: 'Align Items',
  category: LAYOUT,
});
export const JustifyContentSchema = Type.String({
  title: 'Justify Content',
  category: LAYOUT,
});
export const SpacingSchema = Type.Union([Type.String(), Type.Number()], {
  title: 'Spacing',
  category: LAYOUT,
});

const PropsSchema = Type.Object({
  direction: DirectionSchema,
  wrap: FlexWrapSchema,
  align: AlignItemsSchema,
  justify: JustifyContentSchema,
  spacing: SpacingSchema,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'stack',
    displayName: 'Stack',
    description: 'chakra-ui stack',
    isResizable: true,
    isDraggable: true,
    exampleProperties: {
      direction: 'column',
      spacing: 10,
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    methods: {},
    slots: ['content'],
    styleSlots: [],
    events: [],
  },
})(({ direction, wrap, align, justify, spacing, slotsElements, elementRef }) => {
  return (
    <BaseStack {...{ direction, wrap, align, justify, spacing }} ref={elementRef}>
      {slotsElements.content}
    </BaseStack>
  );
});
