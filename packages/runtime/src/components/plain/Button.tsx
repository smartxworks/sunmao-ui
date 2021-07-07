import React, { useEffect, useRef, useState } from "react";
import { createComponent } from "@meta-ui/core";
import Text, { TextProps } from "../_internal/Text";
import { Implementation } from "../../registry";
import { useExpression } from "../../store";

const Button: Implementation<{ text: TextProps["value"] }> = ({
  text,
  mergeState,
  subscribeMethods,
}) => {
  const [count, add] = useState(0);
  const raw = useExpression(text.raw);
  useEffect(() => {
    mergeState({ value: raw, count });
  }, [raw, count]);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    subscribeMethods({
      click() {
        ref.current?.click();
      },
    });
  });

  return (
    <button ref={ref} onClick={() => add(count + 1)}>
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
      methods: [
        {
          name: "click",
        },
      ],
    },
  }),
  impl: Button,
};
