import React from "react";
import { createComponent } from "@meta-ui/core";
import ReactMarkdown from "react-markdown";

export type TextProps = {
  value?: {
    raw: string;
    format: "plain" | "md";
  };
};

const Text: React.FC<TextProps> = ({
  value = { raw: "**Hello World**", format: "md" },
}) => {
  if (value.format === "md") {
    return <ReactMarkdown>{value.raw}</ReactMarkdown>;
  }
  return <>{value.raw}</>;
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
      state: {},
      methods: [],
    },
  }),
  impl: Text,
};
