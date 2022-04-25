import { Application } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import {
  CORE_VERSION,
  SLOT_TRAIT_NAME,
  EVENT_TRAIT_NAME,
  STYLE_TRAIT_NAME,
  FETCH_TRAIT_NAME,
} from '@sunmao-ui/shared';

export const ignoreTraitsList = [
  `${CORE_VERSION}/${SLOT_TRAIT_NAME}`,
  `${CORE_VERSION}/${EVENT_TRAIT_NAME}`,
  `${CORE_VERSION}/${STYLE_TRAIT_NAME}`,
  `${CORE_VERSION}/${FETCH_TRAIT_NAME}`,
];

export const hasSpecialFormTraitList = [...ignoreTraitsList, `${CORE_VERSION}/${FETCH_TRAIT_NAME}`];

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
