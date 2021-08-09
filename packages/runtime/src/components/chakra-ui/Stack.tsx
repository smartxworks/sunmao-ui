import React from "react";
import { createComponent } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { Stack as BaseStack } from "@chakra-ui/react";
import { ComponentImplementation } from "../../registry";
import Slot from "../_internal/Slot";

export const DirectionSchema = Type.Union([
  Type.KeyOf(
    Type.Object({
      column: Type.String(),
      "column-reverse": Type.String(),
      row: Type.String(),
      "row-reverse": Type.String(),
    })
  ),
  Type.Array(
    Type.KeyOf(
      Type.Object({
        column: Type.String(),
        "column-reverse": Type.String(),
        row: Type.String(),
        "row-reverse": Type.String(),
      })
    )
  ),
]);
export const FlexWrapSchema = Type.KeyOf(
  Type.Object({
    nowrap: Type.String(),
    wrap: Type.String(),
    "wrap-reverse": Type.String(),
  })
);
export const AlignItemsSchema = Type.String();
export const JustifyContentSchema = Type.String();
export const SpacingSchema = Type.Union([Type.String(), Type.Number()]);

const Stack: ComponentImplementation<{
  direction?: Static<typeof DirectionSchema>;
  wrap?: Static<typeof FlexWrapSchema>;
  align?: Static<typeof AlignItemsSchema>;
  justify?: Static<typeof JustifyContentSchema>;
  spacing?: Static<typeof SpacingSchema>;
}> = ({ direction, wrap, align, justify, spacing, slotsMap }) => {
  return (
    <BaseStack {...{ direction, wrap, align, justify, spacing }}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseStack>
  );
};

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "stack",
      description: "chakra-ui stack",
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
  impl: Stack,
};
