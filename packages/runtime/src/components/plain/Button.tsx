import React, { useEffect, useRef } from "react";
import { createComponent } from "@meta-ui/core";
import Text, { TextProps } from "../_internal/Text";
import { ComponentImplementation } from "../../registry";
import { useExpression } from "../../store";

const Button: ComponentImplementation<{
  text: TextProps["value"];
  onClick?: () => void;
}> = ({ text, mergeState, subscribeMethods, onClick }) => {
  const raw = useExpression(text.raw);
  useEffect(() => {
    mergeState({ value: raw });
  }, [raw]);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    subscribeMethods({
      click() {
        ref.current?.click();
      },
    });
  }, []);

  return (
    <button ref={ref} onClick={onClick}>
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
