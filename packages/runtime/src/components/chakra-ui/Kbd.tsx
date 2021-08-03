import React, { useEffect } from "react";
import { Kbd as BaseKbd } from "@chakra-ui/react";
import { Type } from "@sinclair/typebox";
import { createComponent } from "@meta-ui/core";
import { ComponentImplementation } from "../../registry";
import Text, { TextProps, TextPropertySchema } from "../_internal/Text";
import { useExpression } from "../../store";

const Kbd: ComponentImplementation<{
  text: TextProps["value"];
}> = ({ text, mergeState }) => {
  const raw = useExpression(text.raw);
  useEffect(() => {
    mergeState({ value: raw });
  }, [raw]);

  return (
    <BaseKbd>
      <Text value={{ ...text, raw }} />
    </BaseKbd>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "kbd",
      description: "chakra-ui keyboard",
    },
    spec: {
      properties: [
        {
          name: "text",
          ...TextPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Kbd,
};
