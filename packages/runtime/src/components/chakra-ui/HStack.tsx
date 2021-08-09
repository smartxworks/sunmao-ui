import React from "react";
import { createComponent } from "@meta-ui/core";
import { Static } from "@sinclair/typebox";
import { HStack as BaseVStack } from "@chakra-ui/react";
import { ComponentImplementation } from "../../registry";
import Slot from "../_internal/Slot";
import {
  DirectionSchema,
  FlexWrapSchema,
  AlignItemsSchema,
  JustifyContentSchema,
  SpacingSchema,
} from "./Stack";

const HStack: ComponentImplementation<{
  direction?: Static<typeof DirectionSchema>;
  wrap?: Static<typeof FlexWrapSchema>;
  align?: Static<typeof AlignItemsSchema>;
  justify?: Static<typeof JustifyContentSchema>;
  spacing?: Static<typeof SpacingSchema>;
}> = ({ direction, wrap, align, justify, spacing, slotsMap }) => {
  return (
    <BaseVStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseVStack>
  );
};

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "hstack",
      description: "chakra-ui hstack",
    },
    spec: {
      properties: [
        {
          name: "diection",
          ...DirectionSchema,
        },
        {
          name: "wrap",
          ...FlexWrapSchema,
        },
        {
          name: "align",
          ...AlignItemsSchema,
        },
        {
          name: "justify",
          ...JustifyContentSchema,
        },
        {
          name: "spacing",
          ...SpacingSchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: HStack,
};
