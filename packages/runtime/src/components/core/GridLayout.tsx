import React, { Suspense } from 'react';
import { ComponentImplementation } from 'services/registry';
import { createComponent } from '@sunmao-ui/core';
import { getSlots } from '../_internal/Slot';
import { Static, Type } from '@sinclair/typebox';
import { partial } from 'lodash-es';
import { css } from '@emotion/react';

const BaseGridLayout = React.lazy(() => import('../_internal/GridLayout'));

const GridLayout: ComponentImplementation<Static<typeof PropsSchema>> = ({
  slotsMap,
  layout = [],
  gridCallbacks,
  component,
  customStyle,
}) => {
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
        css={css`${customStyle?.content}`}
      >
        {getSlots(slotsMap, 'content')}
      </BaseGridLayout>
    </Suspense>
  );
};

const PropsSchema = Type.Object({
  layout: Type.Array(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      w: Type.Number(),
      h: Type.Number(),
      i: Type.String(),
      isResizable: Type.Optional(Type.Boolean()),
    })
  ),
});

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'grid_layout',
      displayName: 'Grid Layout',
      description: 'drag and drop to layout in a grid',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        layout: [],
      },
      exampleSize: [6, 6],
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [],
      slots: ['content'],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: GridLayout,
};
