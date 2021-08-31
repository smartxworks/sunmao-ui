import React, { Suspense } from 'react';
import { ComponentImplementation } from '../../registry';
import { createComponent } from '@meta-ui/core';
import { getSlots } from '../_internal/Slot';
import { LayoutPropertySchema } from '../../components/_internal/GridLayout';
import { Static } from '@sinclair/typebox';

const BaseGridLayout = React.lazy(
  () => import('../../components/_internal/GridLayout')
);

const GridLayout: ComponentImplementation<{
  layout: Static<typeof LayoutPropertySchema>;
}> = ({ slotsMap, layout = [] }) => {
  return (
    <Suspense fallback={null}>
      <BaseGridLayout layout={layout}>
        {getSlots(slotsMap, 'container')}
      </BaseGridLayout>
    </Suspense>
  );
};

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'grid_layout',
      description: 'drag and drop to layout in a grid',
    },
    spec: {
      properties: [{ name: 'layout', ...LayoutPropertySchema }],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: GridLayout,
};
