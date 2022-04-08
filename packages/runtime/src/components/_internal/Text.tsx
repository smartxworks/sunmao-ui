import React from 'react';
import { css } from '@emotion/css';
import ReactMarkdown from 'react-markdown';
import { Static, Type } from '@sinclair/typebox';

export const TextPropertySpec = Type.Object(
  {
    raw: Type.String({
      title: 'Raw',
    }),
    format: Type.KeyOf(
      Type.Object({
        plain: Type.String(),
        md: Type.String(),
      }),
      {
        title: 'Format',
      }
    ),
  },
  {
    title: 'Text',
    category: 'Basic',
  }
);

export type TextProps = {
  value: Static<typeof TextPropertySpec>;
  cssStyle?: string;
};

const Text = React.forwardRef<HTMLDivElement, TextProps>(({ value, cssStyle }, ref) => {
  const text = typeof value.raw === 'string' ? value.raw : `${value.raw}`;
  if (value.format === 'md') {
    return (
      <div
        className={css`
          ${cssStyle}
        `}
        ref={ref}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  return (
    <span
      className={css`
        ${cssStyle}
      `}
      ref={ref}
    >
      {text}
    </span>
  );
});

export default Text;
