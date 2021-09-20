import React from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { HStack as BaseHStack } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import {
  DirectionSchema,
  FlexWrapSchema,
  AlignItemsSchema,
  JustifyContentSchema,
  SpacingSchema,
} from './Stack';

const HStack: ComponentImplementation<Static<typeof PropsSchema>> = ({
  direction,
  wrap,
  align,
  justify,
  spacing,
  slotsMap,
}) => {
  return (
    <BaseHStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseHStack>
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
      name: 'hstack',
      description: 'chakra-ui hstack',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: HStack,
};
