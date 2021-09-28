import React, { Suspense } from 'react';
import RGL from 'react-grid-layout';
import { ComponentImplementation } from '../../modules/registry';
import { createComponent } from '@meta-ui/core';
import { getSlots } from '../_internal/Slot';
import { LayoutPropertySchema } from '../../components/_internal/GridLayout';
import { Static, Type } from '@sinclair/typebox';

const BaseGridLayout = React.lazy(() => import('../../components/_internal/GridLayout'));

const GridLayout: ComponentImplementation<Static<typeof PropsSchema>> = ({
  slotsMap,
  layout = [],
  onLayoutChange,
  component,
}) => {
  const _onLayoutChange = (layout: RGL.Layout[]) => {
    onLayoutChange && onLayoutChange(component.id, layout);
  };
  return (
    <Suspense fallback={null}>
      <BaseGridLayout onLayoutChange={_onLayoutChange} layout={layout}>
        {getSlots(slotsMap, 'container')}
      </BaseGridLayout>
    </Suspense>
  );
};

const PropsSchema = Type.Object({
  layout: LayoutPropertySchema,
});

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'grid_layout',
      description: 'drag and drop to layout in a grid',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: GridLayout,
};
