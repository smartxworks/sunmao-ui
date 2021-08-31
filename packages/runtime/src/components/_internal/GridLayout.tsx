import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Static, Type } from '@sinclair/typebox';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export const LayoutPropertySchema = Type.Array(
  Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    w: Type.Number(),
    h: Type.Number(),
    i: Type.String(),
  })
);

const GridLayout: React.FC<{
  layout: Static<typeof LayoutPropertySchema>;
}> = ({ children, layout }) => {
  return (
    <ReactGridLayout rowHeight={30} layout={layout}>
      {children}
    </ReactGridLayout>
  );
};

export default GridLayout;
