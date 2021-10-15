import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { VStack as BaseVStack } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import Slot from '../_internal/Slot';
import {
  DirectionSchema,
  FlexWrapSchema,
  AlignItemsSchema,
  JustifyContentSchema,
  SpacingSchema,
} from './Stack';

const VStack: ComponentImplementation<Static<typeof PropsSchema>> = ({
  direction,
  wrap,
  align,
  justify,
  spacing,
  slotsMap,
}) => {
  return (
    <BaseVStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseVStack>
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
      name: 'vstack',
      displayName: 'VStack',
      description: 'chakra-ui vstack',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        spacing: 4,
        align: 'stretch',
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
  impl: VStack,
};
