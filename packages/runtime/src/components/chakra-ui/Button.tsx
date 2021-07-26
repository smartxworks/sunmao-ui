import React, { useEffect, useRef } from "react";
import { createComponent } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { Button as BaseButton, ChakraProvider } from "@chakra-ui/react";
import Text, { TextProps, TextPropertySchema } from "../_internal/Text";
import { ComponentImplementation } from "../../registry";
import { useExpression } from "../../store";

const Button: ComponentImplementation<{
  text: TextProps["value"];
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
  isLoading?: Static<typeof IsLoadingPropertySchema>;
  onClick?: () => void;
}> = ({ text, mergeState, subscribeMethods, onClick, ...rest }) => {
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

const ColorSchemePropertySchema = Type.Optional(
  Type.KeyOf(
    Type.Object({
      whiteAlpha: Type.String(),
      blackAlpha: Type.String(),
      gray: Type.String(),
      red: Type.String(),
      orange: Type.String(),
      yellow: Type.String(),
      green: Type.String(),
      teal: Type.String(),
      blue: Type.String(),
      cyan: Type.String(),
      purple: Type.String(),
      pink: Type.String(),
      linkedin: Type.String(),
      facebook: Type.String(),
      messenger: Type.String(),
      whatsapp: Type.String(),
      twitter: Type.String(),
      telegram: Type.String(),
    })
  )
);
const IsLoadingPropertySchema = Type.Optional(Type.Boolean());

const StateSchema = Type.Object({
  value: Type.String(),
});

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
          ...TextPropertySchema,
        },
        {
          name: "colorScheme",
          ...ColorSchemePropertySchema,
        },
        {
          name: "isLoading",
          ...IsLoadingPropertySchema,
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
