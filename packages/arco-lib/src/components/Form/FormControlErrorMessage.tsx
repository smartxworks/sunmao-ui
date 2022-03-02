import { css } from '@emotion/css';

const FormControlErrorMessage: React.FC<{ errorMsg: string }> = ({ errorMsg }) => {
  return errorMsg ? (
    <div
      className={css`
        color: rgb(245, 63, 63);
        line-height: 20px;
        min-height: 20px;
      `}
    >
      {errorMsg}
    </div>
  ) : null;
};

export { FormControlErrorMessage };
