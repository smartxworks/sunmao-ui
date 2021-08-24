import React, { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import { Static, Type } from '@sinclair/typebox';

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
  style?: CSSProperties;
};

const Text: React.FC<TextProps> = ({ value, style }) => {
  if (value.format === 'md') {
    return <ReactMarkdown>{value.raw}</ReactMarkdown>;
  }
  return <span style={style}>{value.raw}</span>;
};

export default Text;
