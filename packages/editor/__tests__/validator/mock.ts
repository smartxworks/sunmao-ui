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
        format: 'plain',
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
        format: 'plain',
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
        format: 'plain',
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

export const LocalVariableInIIFEExpressionSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{(function(foo) {return foo})("bar") }}',
        format: 'plain',
      },
    },
    traits: [],
  },
];

export const DynamicStateTraitAnyTypeSchema: ComponentSchema[] = [
  {
    id: 'state0',
    type: 'core/v1/dummy',
    properties: {},
    traits: [
      {
        type: 'core/v1/state',
        properties: {
          key: 'value',
          initialValue: '{{ { foo: "bar" } }}',
        },
      },
    ],
  },
  {
    id: 'text4',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{state0.value.foo}}',
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
        format: 'plain',
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
        format: 'plain',
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
        format: 'plain',
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
            {
              type: 'onClick',
              componentId: '$utils',
              method: {
                name: 'core/v1/scrollToComponent',
                parameters: {},
              },
            },
          ],
        },
      },
    ],
  },
];

export const EventTraitMethodSchema: ComponentSchema[] = [
  {
    id: 'text1',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: 'hello',
        format: 'plain',
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
        format: 'plain',
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

export const DynamicStateTraitSchema: ComponentSchema[] = [
  {
    id: 'localStorage0',
    type: 'core/v1/dummy',
    properties: {},
    traits: [
      {
        type: 'core/v1/localStorage',
        properties: {
          key: 'value',
          initialValue: {},
          version: 0,
        },
      },
    ],
  },
  {
    id: 'text3',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{localStorage0.value}}',
        format: 'plain',
      },
    },
    traits: [
      {
        type: 'core/v1/state',
        properties: {
          key: 'foo',
          initialValue: {},
        },
      },
    ],
  },
  {
    id: 'state0',
    type: 'core/v1/dummy',
    properties: {},
    traits: [
      {
        type: 'core/v1/state',
        properties: {
          key: 'value',
          initialValue: 123,
        },
      },
    ],
  },
  {
    id: 'text4',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: '{{state0.value}}{{text3.foo}}',
        format: 'plain',
      },
    },
    traits: [],
  },
];

export const NestedObjectExpressionSchema: ComponentSchema[] = [
  {
    id: 'api0',
    type: 'core/v1/dummy',
    properties: {},
    traits: [
      {
        type: 'core/v1/fetch',
        properties: {
          url: '',
          method: 'get',
          lazy: false,
          disabled: false,
          headers: {},
          body: {},
          bodyType: 'json',
          onComplete: [
            {
              componentId: '',
              method: {
                name: '',
              },
            },
          ],
          onError: [
            {
              componentId: '',
              method: {
                name: '',
                parameters: {},
              },
              // should not warn api0.fetch.code
              disabled: '{{ api0.fetch.code !== 401 }}',
            },
          ],
        },
      },
    ],
  },
];
