import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Stack as BaseStack } from '@chakra-ui/react';
import { ComponentImplementation } from 'services/registry';
import Slot from '../_internal/Slot';

export const DirectionSchema = Type.Union([
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
]);
export const FlexWrapSchema = Type.KeyOf(
  Type.Object({
    nowrap: Type.String(),
    wrap: Type.String(),
    'wrap-reverse': Type.String(),
  })
);
export const AlignItemsSchema = Type.String();
export const JustifyContentSchema = Type.String();
export const SpacingSchema = Type.Union([Type.String(), Type.Number()]);

const Stack: ComponentImplementation<Static<typeof PropsSchema>> = ({
  direction,
  wrap,
  align,
  justify,
  spacing,
  slotsMap,
}) => {
  return (
    <BaseStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseStack>
  );
};

const PropsSchema = Type.Object({
  direction: DirectionSchema,
  wrap: FlexWrapSchema,
  align: AlignItemsSchema,
  justify: JustifyContentSchema,
  spacing: SpacingSchema,
});

export default {
  ...createComponent({
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
      state: {},
      methods: [],
      slots: ['content'],
      styleSlots: [],
      events: [],
    },
  }),
  impl: Stack,
};
