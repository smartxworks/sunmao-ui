import RGL from 'react-grid-layout';
import React from 'react';
import { css } from '@emotion/css';
import { useResizeDetector } from 'react-resize-detector';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DROP_EXAMPLE_SIZE_PREFIX, GRID_HEIGHT } from '../../constants';
import { decodeDragDataTransfer } from '../../utils/encodeDragDataTransfer';

const GridLayout: React.FC<RGL.ReactGridLayoutProps> = props => {
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

  const onDropDragOver = (e: any) => {
    // Here we need to get data in dataTransfer
    // but normally we cannot access dataTransfer in onDragOver, so I use a hack
    // I use the key of dataTransfer to store data, the key will look like 'exampleSize: [1,4]'
    // https://stackoverflow.com/questions/28487352/dragndrop-datatransfer-getdata-empty
    const key = (e as React.DragEvent).dataTransfer.types
      .map(decodeDragDataTransfer)
      .find(t => t.startsWith(DROP_EXAMPLE_SIZE_PREFIX));
    if (key) {
      const componentSize = JSON.parse(key?.replace(DROP_EXAMPLE_SIZE_PREFIX, '') || '');
      return { w: componentSize[0], h: componentSize[1] };
    }
  };

  return (
    <div ref={ref} className={bgCss}>
      <RGL
        cols={12}
        compactType={null}
        preventCollision={true}
        rowHeight={GRID_HEIGHT}
        width={width || 0}
        margin={[spacing, spacing]}
        isDroppable={true}
        onDropDragOver={onDropDragOver}
        {...props}
      >
        {children}
      </RGL>
    </div>
  );
};

export default GridLayout;
