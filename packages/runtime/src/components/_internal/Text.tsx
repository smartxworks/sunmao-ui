import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { Static, Type } from '@sinclair/typebox';

export const TextPropertySchema = Type.Object({
  raw: Type.String({
    title: 'Raw',
  }),
  format: Type.KeyOf(
    Type.Object({
      plain: Type.String(),
      md: Type.String(),
    }), {
      title: 'Format',
    }
  ),
}, {
  title: 'Text',
  category: 'Basic',
});

export type TextProps = {
  value: Static<typeof TextPropertySchema>;
  cssStyle?: string;
};

const Text = React.forwardRef<HTMLDivElement, TextProps>(({ value, cssStyle }, ref) => {
  const text = typeof value.raw === 'string' ? value.raw : `${value.raw}`;
  if (value.format === 'md') {
    const Div = styled.div`
      ${cssStyle}
    `;
    return (
      <Div ref={ref}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </Div>
    );
  }

  // TODO: For some unknown reason, emotion css doesn't work in this file. So I use styled instead.
  const Span = styled.span`
    ${cssStyle}
  `;
  return <Span ref={ref}>{text}</Span>;
});

export default Text;
