import React, { useEffect } from "react";
import { createComponent } from "@meta-ui/core";
import { Type } from "@sinclair/typebox";
import { ComponentImplementation } from "../../registry";
import _Text, { TextProps, TextPropertySchema } from "../_internal/Text";

const Text: ComponentImplementation<TextProps> = ({ value, mergeState }) => {
  useEffect(() => {
    mergeState({ value: value.raw });
  }, [value.raw]);

  return <_Text value={value} />;
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
