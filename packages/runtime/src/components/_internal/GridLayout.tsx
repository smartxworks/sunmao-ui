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
    isResizable: Type.Optional(Type.Boolean()),
  })
);

const GridLayout: React.FC<{
  layout: Static<typeof LayoutPropertySchema>;
  onLayoutChange?: (layout: RGL.Layout[]) => void;
}> = ({ children, layout, onLayoutChange }) => {
  return (
    <ReactGridLayout
      isDraggable={!!onLayoutChange}
      isResizable={!!onLayoutChange}
      compactType={null}
      preventCollision={true}
      rowHeight={30}
      layout={layout}
      onLayoutChange={onLayoutChange}
      onDragStart={() => {
        console.log('dragstart');
      }}
      // onDrop={onLayoutChange}
      isDroppable={true}
    >
      {children}
    </ReactGridLayout>
  );
};

export default GridLayout;
