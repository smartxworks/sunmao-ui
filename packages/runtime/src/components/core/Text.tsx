import React, { useEffect } from "react";
import { createComponent } from "@meta-ui/core";
import { Implementation } from "../../registry";
import _Text, { TextProps } from "../_internal/Text";
import { useExpression } from "../../store";

const Text: Implementation<TextProps> = ({ value, mergeState }) => {
  const raw = useExpression(value.raw);

  useEffect(() => {
    mergeState({ value: raw });
  }, [raw]);

  // console.log("render text");

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
