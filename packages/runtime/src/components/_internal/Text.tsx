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
  const text = typeof value.raw === 'string' ? value.raw : `${value.raw}`;
  if (value.format === 'md') {
    const Div = styled.div`
      ${cssStyle}
    `;
    return (
      <Div>
        <ReactMarkdown>{text}</ReactMarkdown>
      </Div>
    );
  }

  // TODO: For some unknown reason, emotion css doesn't work in this file. So I use styled instead.
  const Span = styled.span`
    ${cssStyle}
  `;
  return <Span>{text}</Span>;
};

export default Text;
