import { Application } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';

export const ignoreTraitsList = [
  'core/v1/slot',
  'core/v1/event',
  'core/v1/style',
  'core/v1/fetch',
];

export const hasSpecialFormTraitList = [...ignoreTraitsList, 'core/v1/fetch'];

export const RootId = '__root__';

export const EmptyAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'sunmao application', description: 'sunmao empty application' },
  spec: {
    components: [],
  },
};

// need not add moduleId, because it is used in runtime of editor
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
  impl: [
    {
      id: 'text1',
      type: 'core/v1/text',
      properties: { value: { raw: 'Hello, world!', format: 'plain' } },
      traits: [],
    },
  ],
};
