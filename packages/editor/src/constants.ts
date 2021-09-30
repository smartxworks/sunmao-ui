import { Application } from '@meta-ui/core';

export const DefaultAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'basic_grid_layout', description: 'basic grid layout example' },
  spec: {
    components: [
      {
        id: 'grid',
        type: 'core/v1/grid_layout',
        properties: {
          layout: [
            {
              w: 10,
              h: 2,
              x: 0,
              y: 0,
              i: 'image',
              moved: false,
              static: false,
              isDraggable: true,
            },
            {
              w: 3,
              h: 1,
              x: 7,
              y: 2,
              i: 'button',
              moved: false,
              static: false,
              isDraggable: true,
            },
            {
              w: 3,
              h: 1,
              x: 0,
              y: 2,
              i: 'input',
              moved: false,
              static: false,
              isDraggable: true,
            },
          ],
        },
        traits: [],
      },
      {
        id: 'image',
        type: 'chakra_ui/v1/image',
        properties: {
          src: 'https://www.smartx.com/img/smartx-logo-horizontal.ff708dd4.svg',
          objectFit: '',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'grid', slot: 'container' } },
          },
        ],
      },
      {
        id: 'button',
        type: 'chakra_ui/v1/button',
        properties: { text: { raw: '确认' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'grid', slot: 'container' } },
          },
        ],
      },
      {
        id: 'input',
        type: 'chakra_ui/v1/input',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'grid', slot: 'container' } },
          },
        ],
      },
    ],
  },
};
