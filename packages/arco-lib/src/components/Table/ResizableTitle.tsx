import { css } from '@emotion/css';
import { CSSProperties } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

const resizableStyle = css`
  position: relative;
  background-clip: padding-box;
`;
const resizableHandleStyle = css`
  position: absolute;
  width: 10px;
  height: 100%;
  bottom: 0;
  right: -5px;
  cursor: col-resize;
  z-index: 1;
`;

type ResizableTitleProps = {
  onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
  width: number;
  style: CSSProperties;
};

export const ResizableTitle = (props: ResizableTitleProps) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className={css`
            ${resizableStyle}
            ${resizableHandleStyle}
          `}
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
