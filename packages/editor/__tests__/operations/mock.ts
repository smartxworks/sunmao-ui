import { Application } from '@sunmao-ui/core';

export const AppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'text1',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [],
      },
    ],
  },
};
export const PasteComponentWithChildrenSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'stack3',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'stack5',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack3',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text6',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack5',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
    ],
  },
};

export const PasteComponentWithCopyComponent: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'stack3',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'stack5',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack3',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text6',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack5',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'stack5_copy0',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack3',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text6_copy0',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack5_copy0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
    ],
  },
};
