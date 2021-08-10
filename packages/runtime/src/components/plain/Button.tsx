import React, { useEffect, useRef } from "react";
import { createComponent } from "@meta-ui/core";
import { Type } from "@sinclair/typebox";
import Text, { TextProps, TextPropertySchema } from "../_internal/Text";
import { ComponentImplementation } from "../../registry";

const Button: ComponentImplementation<{
  text: TextProps["value"];
  onClick?: () => void;
}> = ({ text, mergeState, subscribeMethods, onClick }) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [text.raw]);

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
      <Text value={text} />
    </button>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

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
          ...TextPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [
        {
          name: "click",
        },
      ],
    },
  }),
  impl: Button,
};
