import { Application } from '@sunmao-ui/core';

export const ignoreTraitsList = ['core/v1/slot', 'core/v1/event', 'core/v1/fetch'];

export const EmptyAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'dialog_component',
    description: 'dialog component example',
  },
  spec: {
    components: [
      {
        id: 'gridLayout1',
        type: 'core/v1/grid_layout',
        properties: {
          layout: [],
        },
        traits: [],
      },
    ],
  },
};
