import RGL, { WidthProvider } from 'react-grid-layout';
import { Static, Type } from '@sinclair/typebox';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { GRID_HEIGHT } from '../../constants';

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
  onDragStop?: (layout: RGL.Layout[]) => void;
  onDrop?: (layout: RGL.Layout[], item: RGL.Layout, event: DragEvent) => void;
}> = ({ children, layout, onDragStop, onDrop }) => {
  return (
    <ReactGridLayout
      isDraggable={!!onDragStop}
      isResizable={!!onDragStop}
      compactType={null}
      preventCollision={true}
      rowHeight={GRID_HEIGHT}
      layout={layout}
      onDragStop={onDragStop}
      onDrop={onDrop}
      isDroppable={true}
    >
      {children}
    </ReactGridLayout>
  );
};

export default GridLayout;
