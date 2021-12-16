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
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'input1',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: "background: red",
            },
          },
        ],
      },
      {
        id: 'input2',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [],
      },
      {
        id: 'input3',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [],
      },
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
      {
        id: 'button1',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button2',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button3',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
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
