import React from "react";
import ReactMarkdown from "react-markdown";
import { Static, Type } from "@sinclair/typebox";

export const TextPropertySchema = Type.Object({
  raw: Type.String(),
  format: Type.KeyOf(
    Type.Object({
      plain: Type.String(),
      md: Type.String(),
    })
  ),
});

export type TextProps = {
  value: Static<typeof TextPropertySchema>;
};

const Text: React.FC<TextProps> = ({ value }) => {
  if (value.format === "md") {
    return <ReactMarkdown>{value.raw}</ReactMarkdown>;
  }
  return <>{value.raw}</>;
};

export default Text;
