import React, { useEffect, useRef } from "react";
import { createComponent } from "@meta-ui/core";
import {
  Button as BaseButton,
  ChakraProvider,
  ButtonProps as BaseButtonProps,
} from "@chakra-ui/react";
import Text, { TextProps } from "../_internal/Text";
import { ComponentImplementation } from "../../registry";
import { useExpression } from "../../store";

const Button: ComponentImplementation<
  BaseButtonProps & {
    text: TextProps["value"];
    onClick?: () => void;
  }
> = ({ text, mergeState, subscribeMethods, onClick, ...rest }) => {
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
    <ChakraProvider>
      <BaseButton {...rest} ref={ref} onClick={onClick}>
        <Text value={{ ...text, raw }} />
      </BaseButton>
    </ChakraProvider>
  );
};

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "button",
      description: "chakra-ui button",
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
        {
          name: "colorScheme",
          type: "string",
          enum: [
            "whiteAlpha",
            "blackAlpha",
            "gray",
            "red",
            "orange",
            "yellow",
            "green",
            "teal",
            "blue",
            "cyan",
            "purple",
            "pink",
            "linkedin",
            "facebook",
            "messenger",
            "whatsapp",
            "twitter",
            "telegram",
          ],
        },
        {
          name: "isLoading",
          type: "boolean",
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
