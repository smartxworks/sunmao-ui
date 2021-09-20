import { css } from '@emotion/react';

export const FormControlCSS = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  align-items: end;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormControlContentCSS = css`
  display: flex;
  width: 100%;
`;

export const FormLabelCSS = css`
  flex: 0 0 auto;
  width: 33%;
  margin: auto 0;
`;

export const FormItemCSS = css`
  flex: 0 0 auto;
  width: 66%;
`;
