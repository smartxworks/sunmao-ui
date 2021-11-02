import { css } from '@emotion/react';
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
  cssStyle?: string;
};

const Text: React.FC<TextProps> = ({ value, cssStyle }) => {
  if (value.format === 'md') {
    return <ReactMarkdown>{value.raw}</ReactMarkdown>;
  }
  return (
    <span
      css={css`
        ${cssStyle}
      `}
    >
      {value.raw}
    </span>
  );
};

export default Text;
