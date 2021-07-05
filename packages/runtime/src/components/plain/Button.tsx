import React from "react";
import { createComponent } from "@meta-ui/core";
import Text, { TextProps } from "../core/Text";

const Button: React.FC<{ text?: TextProps["value"] }> = ({ text }) => {
  return (
    <button>
      <Text.impl value={text} />
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
      state: {},
      methods: [],
    },
  }),
  impl: Button,
};
