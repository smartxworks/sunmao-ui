import React, { useEffect } from "react";
import { createComponent } from "@meta-ui/core";
import { ComponentImplementation } from "../../registry";
import _Text, { TextProps } from "../_internal/Text";
import { useExpression } from "../../store";

const Text: ComponentImplementation<TextProps> = ({ value, mergeState }) => {
  const raw = useExpression(value.raw);

  useEffect(() => {
    mergeState({ value: raw });
  }, [raw]);

  return <_Text value={{ ...value, raw }} />;
};

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
          type: "object",
          properties: {
            raw: {
              type: "string",
            },
            format: {
              type: "string",
              enum: ["plain", "md"],
            },
          },
        },
      ],
      acceptTraits: [],
      state: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
        },
      },
      methods: [],
    },
  }),
  impl: Text,
};
