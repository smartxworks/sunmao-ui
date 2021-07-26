import React, { useEffect } from "react";
import { createComponent } from "@meta-ui/core";
import { Type } from "@sinclair/typebox";
import { ComponentImplementation } from "../../registry";
import _Text, { TextProps, TextPropertySchema } from "../_internal/Text";
import { useExpression } from "../../store";

const Text: ComponentImplementation<TextProps> = ({ value, mergeState }) => {
  const raw = useExpression(value.raw);

  useEffect(() => {
    mergeState({ value: raw });
  }, [raw]);

  return <_Text value={{ ...value, raw }} />;
};

const StateSchema = Type.Object({
  value: Type.String(),
});

export default {
  ...createComponent({
    version: "core/v1",
    metadata: {
      name: "text",
      description: "support plain and markdown formats",
    },
    spec: {
      properties: [
        {
          name: "value",
          ...TextPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Text,
};
