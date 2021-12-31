import { Type } from '@sinclair/typebox';
import { Stack as BaseStack } from '@chakra-ui/react';
import { implementRuntimeComponent2 } from '@sunmao-ui/runtime';

export const DirectionSchema = Type.Optional(
  Type.Union([
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
  ])
);
export const FlexWrapSchema = Type.Optional(
  Type.KeyOf(
    Type.Object({
      nowrap: Type.String(),
      wrap: Type.String(),
      'wrap-reverse': Type.String(),
    })
  )
);
export const AlignItemsSchema = Type.Optional(Type.String());
export const JustifyContentSchema = Type.Optional(Type.String());
export const SpacingSchema = Type.Optional(Type.Union([Type.String(), Type.Number()]));

const PropsSchema = Type.Object({
  direction: DirectionSchema,
  wrap: FlexWrapSchema,
  align: AlignItemsSchema,
  justify: JustifyContentSchema,
  spacing: SpacingSchema,
});

export default implementRuntimeComponent2({
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
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    methods: {},
    slots: ['content'],
    styleSlots: [],
    events: [],
  },
})(({ direction, wrap, align, justify, spacing, Slot }) => {
  return (
    <BaseStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slot="content" />
    </BaseStack>
  );
});
