import React, { useEffect, useState } from "react";
import { createComponent } from "@meta-ui/core";
import Text, { TextProps } from "../_internal/Text";
import { Implementation } from "../../registry";
import { useExpression } from "../../store";

const Button: Implementation<{ text: TextProps["value"] }> = ({
  text,
  mergeState,
}) => {
  const [count, add] = useState(0);
  const raw = useExpression(text.raw);
  useEffect(() => {
    mergeState({ value: raw, count });
  }, [raw, count]);

  return (
    <button onClick={() => add(count + 1)}>
      <Text value={{ ...text, raw }} />
    </button>
  );
};

export default {
  ...createComponent({
    version: "plain/v1",
    metadata: {
      name: "button",
      description: "plain button",
    },
    spec: {
      properties: [
        {
          name: "text",
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
  impl: Button,
};
