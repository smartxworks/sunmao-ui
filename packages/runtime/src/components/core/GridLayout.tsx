import React, { Suspense } from 'react';
import { ComponentImplementation } from '../../services/registry';
import { createComponent } from '@meta-ui/core';
import { getSlots } from '../_internal/Slot';
import { Static, Type } from '@sinclair/typebox';
import { partial } from 'lodash';

const BaseGridLayout = React.lazy(() => import('../../components/_internal/GridLayout'));

const GridLayout: ComponentImplementation<Static<typeof PropsSchema>> = ({
  slotsMap,
  layout = [],
  gridCallbacks,
  component,
}) => {
  const onDragStop = gridCallbacks?.onDragStop
    ? partial(gridCallbacks.onDragStop, component.id)
    : undefined;
  const onDrop = gridCallbacks?.onDrop
    ? partial(gridCallbacks.onDrop, component.id)
    : undefined;

  return (
    <Suspense fallback={null}>
      <BaseGridLayout onDragStop={onDragStop} onDrop={onDrop} layout={layout}>
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
      styleSlots: [],
      events: [],
    },
  }),
  impl: GridLayout,
};
