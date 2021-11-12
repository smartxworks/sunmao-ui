import styled from '@emotion/styled';
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
    const P = styled.p`
      ${cssStyle}
    `;
    return (
      <P>
        <ReactMarkdown>{value.raw}</ReactMarkdown>
      </P>
    );
  }

  // TODO: For some unknown reason, emotion css doesn't work in this file. So I use styled instead.
  const Span = styled.span`
    ${cssStyle}
  `;
  return <Span>{value.raw}</Span>;
};

export default Text;
