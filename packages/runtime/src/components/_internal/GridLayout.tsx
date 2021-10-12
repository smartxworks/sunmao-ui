import RGL from 'react-grid-layout';
import { css } from '@emotion/react';
import { useResizeDetector } from 'react-resize-detector';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { GRID_HEIGHT } from '../../constants';

const GridLayout: React.FC<ReactGridLayout.ReactGridLayoutProps> = props => {
  const { children } = props;
  const spacing = 10;
  const { width, ref } = useResizeDetector();

  const bgCss = css`
    height: 100%;
    background: white;
    background-image: linear-gradient(#eee 1px, transparent 0),
      linear-gradient(90deg, #eee 1px, transparent 0);
    background-size: ${(width || 0) / 12}px ${GRID_HEIGHT + spacing}px;
    background-position: 0px ${spacing / 2}px;
  `;

  return (
    <div ref={ref} css={bgCss}>
      <RGL
        cols={12}
        // isDraggable={!!onDragStop}
        // isResizable={!!onDragStop}
        compactType={null}
        preventCollision={true}
        rowHeight={GRID_HEIGHT}
        width={width || 0}
        margin={[spacing, spacing]}
        isDroppable={true}
        {...props}
      >
        {children}
      </RGL>
    </div>
  );
};

export default GridLayout;
