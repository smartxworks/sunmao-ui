import React from "react";
import ReactMarkdown from "react-markdown";

export type TextProps = {
  value: {
    raw: string;
    format: "plain" | "md";
  };
};

const Text: React.FC<TextProps> = ({ value }) => {
  if (value.format === "md") {
    return <ReactMarkdown>{value.raw}</ReactMarkdown>;
  }
  return <>{value.raw}</>;
};

export default Text;
