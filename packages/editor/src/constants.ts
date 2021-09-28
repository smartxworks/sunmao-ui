import { Application } from '@meta-ui/core';

export const DefaultAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'basic_grid_layout',
    description: 'basic grid layout example',
  },
  spec: {
    components: [
      {
        id: 'root',
        type: 'core/v1/grid_layout',
        properties: {
          layout: [
            {
              x: 0,
              y: 0,
              w: 5,
              h: 2,
              i: 'input',
              isResizable: false,
            },
            {
              x: 4,
              y: 0,
              w: 4,
              h: 9,
              i: 'box1',
            },
            {
              x: 8,
              y: 0,
              w: 2,
              h: 12,
              i: 'box2',
            },
          ],
        },
        traits: [],
      },
      {
        id: 'input',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'filled',
          placeholder: 'This a example',
          size: 'lg',
          colorScheme: 'pink',
          focusBorderColor: 'pink.500',
          isDisabled: false,
          isRequired: true,
          left: {
            type: 'addon',
            children: 'https://',
          },
          right: {
            type: 'element',
            children: '.com',
            color: 'red',
            fontSize: '16px',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'container',
              },
            },
          },
        ],
      },
      {
        id: 'box1',
        type: 'chakra_ui/v1/box',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'container',
              },
            },
          },
        ],
      },
      {
        id: 'box2',
        type: 'chakra_ui/v1/box',
        properties: {
          bgColor: 'pink',
          w: '100%',
          h: '100%',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'container',
              },
            },
          },
        ],
      },
    ],
  },
};
