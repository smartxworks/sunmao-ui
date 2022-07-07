import { ComponentSchema } from '@sunmao-ui/core';

export const OrphanComponentSchema: ComponentSchema[] = [
  {
    id: 'hstack1',
    type: 'chakra_ui/v1/hstack',
    properties: { spacing: '24px' },
    traits: [],
  },
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: { spacing: '24px' },
    traits: [
      {
        type: 'core/v1/slot',
        properties: { container: { id: 'aParent', slot: 'content' } },
      },
    ],
  },
  {
    id: 'text2',
    type: 'core/v1/text',
    properties: { spacing: '24px' },
    traits: [
      {
        type: 'core/v1/slot',
        properties: { container: { id: 'hstack1', slot: 'aSlot' } },
      },
    ],
  },
];

export const ComponentInvalidSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: 'hello',
      },
    },
    traits: [],
  },
  {
    id: 'text2',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: false,
        format: 'md',
      },
    },
    traits: [],
  },
];

export const ComponentPropertyExpressionSchema: ComponentSchema[] = [
  {
    id: 'list',
    type: 'chakra_ui/v1/list',
    properties: {
      listData: '{{ [] }}',
      template: '{{ {} }}',
    },
    traits: [],
  },
];

export const ComponentWrongPropertyExpressionSchema: ComponentSchema[] = [
  {
    id: 'input1',
    type: 'chakra_ui/v1/input',
    properties: {
      variant: 'outline',
      placeholder: '{{data.value}}',
      focusBorderColor: '',
      size: 'md',
      isDisabled: false,
      isRequired: false,
      defaultValue: '',
    },
    traits: [],
  },
  {
    id: 'button1',
    type: 'chakra_ui/v1/button',
    properties: {
      text: {
        raw: '{{fetch.data.value}}',
        format: 'md',
      },
      isLoading: false,
      colorScheme: 'blue',
    },
    traits: [
      {
        type: 'core/v1/event',
        properties: {
          handlers: [
            {
              type: 'onClick',
              componentId: 'input1',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: '{{input1.noValue}}',
                },
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'text3',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{ Math.random2() }}',
        format: 'md',
      },
    },
    traits: [],
  },
];

export const UseDependencyInExpressionSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{foo}}',
        format: 'plain',
      },
    },
    traits: [],
  },
];

export const TraitInvalidSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: 'hello',
        format: 'md',
      },
    },
    traits: [
      {
        type: 'core/v1/state',
        properties: {},
      },
    ],
  },
  {
    id: 'text2',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: 'hello',
        format: 'md',
      },
    },
    traits: [
      {
        type: 'core/v1/state',
        properties: { key: true, initialValue: 'hhh' },
      },
    ],
  },
];

export const EventTraitSchema: ComponentSchema[] = [
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
      focusBorderColor: '',
    },
    traits: [],
  },
  {
    id: 'button1',
    type: 'chakra_ui/v1/button',
    properties: {
      text: {
        raw: 'hello',
        format: 'md',
      },
      isLoading: false,
      colorScheme: 'blue',
    },
    traits: [
      {
        type: 'core/v1/event',
        properties: {
          handlers: [
            {
              type: 'change',
              componentId: 'input1',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: '666',
                },
              },
            },
            {
              type: 'onClick',
              componentId: 'dialog1',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: '666',
                },
              },
            },
            {
              type: 'onClick',
              componentId: 'input1',
              method: {
                name: 'fetch',
                parameters: {
                  value: '666',
                },
              },
            },
            {
              type: 'onClick',
              componentId: 'input1',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: {},
                },
              },
            },
          ],
        },
      },
    ],
  },
];

export const EventTraitTraitMethodSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: 'hello',
        format: 'md',
      },
    },
    traits: [
      {
        type: 'core/v1/state',
        properties: { key: 'value', initialValue: 'hhh' },
      },
    ],
  },
  {
    id: 'button1',
    type: 'chakra_ui/v1/button',
    properties: {
      text: {
        raw: 'hello',
        format: 'md',
      },
      isLoading: false,
      colorScheme: 'blue',
    },
    traits: [
      {
        type: 'core/v1/event',
        properties: {
          handlers: [
            {
              type: 'onClick',
              componentId: 'text1',
              method: {
                name: 'setValue',
                parameters: {
                  key: 'value',
                  value: '666',
                },
              },
            },
          ],
        },
      },
    ],
  },
];
