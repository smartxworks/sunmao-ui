import React, { Suspense } from 'react';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { partial } from 'lodash-es';
import { css } from '@emotion/css';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';

const BaseGridLayout = React.lazy(() => import('../_internal/GridLayout'));

const PropsSpec = Type.Object({
  layout: Type.Array(
    Type.Object({
      x: Type.Number({
        title: 'X',
      }),
      y: Type.Number({
        title: 'Y',
      }),
      w: Type.Number({
        title: 'Width',
      }),
      h: Type.Number({
        title: 'Height',
      }),
      i: Type.String(),
      isResizable: Type.Boolean({
        title: 'Resizable',
      }),
    }),
    {
      title: 'Layout',
      category: 'Layout',
    }
  ),
});

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: CoreComponentName.GridLayout,
    displayName: 'Grid Layout',
    description: 'drag and drop to layout in a grid',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      layout: [],
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: {},
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(({ layout = [], gridCallbacks, component, customStyle, slotsElements }) => {
  const onDragStop = gridCallbacks?.onDragStop
    ? partial(gridCallbacks.onDragStop, component.id)
    : undefined;
  const onDrop = gridCallbacks?.onDrop
    ? partial(gridCallbacks.onDrop, component.id)
    : undefined;

  return (
    <Suspense fallback={null}>
      <BaseGridLayout
        isDraggable={!!gridCallbacks}
        isResizable={!!gridCallbacks}
        onDragStop={onDragStop}
        onDrop={onDrop}
        layout={layout}
        className={css`
          ${customStyle?.content}
        `}
      >
        {slotsElements.content ? slotsElements.content({}) : null}
      </BaseGridLayout>
    </Suspense>
  );
});
