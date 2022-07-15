import React from 'react';
import { css } from '@emotion/css';
import { Static, Type } from '@sinclair/typebox';

export const TextPropertySpec = Type.Object(
  {
    raw: Type.String({
      title: 'Raw',
    }),
    format: Type.KeyOf(
      Type.Object({
        plain: Type.String(),
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
