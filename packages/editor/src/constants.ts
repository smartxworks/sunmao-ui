import { Application } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';

export const ignoreTraitsList = [
  'core/v1/slot',
  'core/v1/event',
  'core/v1/fetch',
  'core/v1/style',
];

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

export const DefaultNewModule: ImplementedRuntimeModule = {
  kind: 'Module',
  parsedVersion: { category: 'custom/v1', value: 'myModule' },
  version: 'custom/v1',
  metadata: { name: 'myModule', description: 'my module' },
  spec: {
    stateMap: {},
    events: [],
    properties: {},
  },
  components: [
    {
      id: 'text1',
      type: 'core/v1/text',
      properties: { value: { raw: 'Hello, world!', format: 'plain' } },
      traits: [],
    },
  ],
};
