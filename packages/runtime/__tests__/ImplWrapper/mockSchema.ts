import { Application } from '@sunmao-ui/core';

export const SingleComponentSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'single',
        type: 'test/v1/tester',
        properties: {
          text: 'Hello, world!',
        },
        traits: [],
      },
    ],
  },
};

// for testing whether a component and its siblings will unmount after schema changes
export const ComponentSchemaChangeSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'staticComponent',
        type: 'test/v1/tester',
        properties: {
          text: 'foo',
        },
        traits: [],
      },
      {
        id: 'dynamicComponent',
        type: 'test/v1/tester',
        properties: {
          text: 'bar',
        },
        traits: [],
      },
    ],
  },
};

export const HiddenTraitSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'input1',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [
          {
            type: 'core/v1/hidden',
            properties: {
              hidden: true,
            },
          },
        ],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{input1.value}}',
        },
        traits: [],
      },
    ],
  },
};

export const ParentRerenderSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          defaultValue: '',
        },
        traits: [],
      },
      {
        id: 'stack6',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: '{{!!input.value}}',
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack6',
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

export const MergeStateSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{input.value}}-{{input2.value}}-{{input3.value}}',
        },
        traits: [],
      },
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [],
      },
      {
        id: 'input2',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'bar',
        },
        traits: [],
      },
      {
        id: 'input3',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'baz',
        },
        traits: [],
      },
    ],
  },
};

export const AsyncMergeStateSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [],
      },
      {
        id: 'text',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'test/v1/timeout',
            properties: {
              value: '{{input.value + Math.random()}}',
            },
          },
        ],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{text.result}}',
        },
        traits: [],
      },
    ],
  },
};

export const TabsWithSlotsSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'nested_components',
    description: 'nested components example',
  },
  spec: {
    components: [
      {
        id: 'tabs',
        type: 'test/v1/tabs',
        properties: {
          tabNames: ['Tab One', 'Tab Two'],
          initialSelectedTabIndex: 0,
        },
        traits: [],
      },
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          text: {
            raw: 'only in tab {{ $slot.tabIndex + 1 }}',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'tabs',
                slot: 'content',
              },
              ifCondition: '{{ $slot.tabIndex === 0 }}',
            },
          },
        ],
      },
    ],
  },
};

export const MultiSlotsSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'sunmao application', description: 'sunmao empty application' },
  spec: {
    components: [
      {
        id: 'testList0',
        type: 'custom/v1/testList',
        properties: { number: 2 },
        traits: [],
      },
      {
        id: 'input1',
        type: 'test/v1/input',
        properties: {
          defaultValue: '1',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'testList0', slot: 'content' },
              ifCondition: '{{$slot.index === 0}}',
            },
          },
        ],
      },
      {
        id: 'input2',
        type: 'test/v1/input',
        properties: {
          defaultValue: '2',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'testList0', slot: 'content' },
              ifCondition: '{{$slot.index === 1}}',
            },
          },
        ],
      },
    ],
  },
};

export const UpdateTraitPropertiesSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'state0',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue: '',
            },
          },
        ],
      },
      {
        id: 'button0',
        type: 'test/v1/button',
        properties: {
          type: 'default',
          status: 'default',
          long: false,
          size: 'default',
          disabled: false,
          loading: false,
          shape: 'square',
          text: '{{state2.value}}',
        },
        traits: [
          {
            type: 'test/v1/count',
            properties: {
              param1: '{{state0.value + state1.value}}',
              param2: '{{!state0.value}}',
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'click',
                  componentId: 'state0',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: 'state0',
                    },
                  },
                  wait: {
                    type: 'debounce',
                    time: 0,
                  },
                  disabled: false,
                },
                {
                  type: 'click',
                  componentId: 'state1',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: 'state1',
                    },
                  },
                  wait: {
                    type: 'debounce',
                    time: 0,
                  },
                  disabled: false,
                },
                {
                  type: 'click',
                  componentId: 'state2',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: 'state2',
                    },
                  },
                  wait: {
                    type: 'debounce',
                    time: 0,
                  },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'state1',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue: '',
            },
          },
        ],
      },
      {
        id: 'state2',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue: '',
            },
          },
        ],
      },
    ],
  },
};

export const EvalSlotPropsWithProxySchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'list6',
        type: 'core/v1/list',
        properties: {
          listData: '{{tableData.value}}',
        },
        traits: [],
      },
      {
        id: 'text7',
        type: 'test/v1/tester',
        properties: {
          text: '{{$slot.$listItem.salary}}',
        },
        traits: [
          {
            type: 'core/v2/slot',
            properties: {
              container: {
                id: 'list6',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'button5',
        type: 'test/v1/button',
        properties: {
          type: 'default',
          status: 'default',
          long: false,
          size: 'default',
          disabled: false,
          loading: false,
          shape: 'square',
          text: 'change',
        },
        traits: [
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'click',
                  componentId: 'tableData',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value:
                        '{{[\n  {\n    "key": 0,\n    "salary": 6000\n  },\n  {\n    "key": 1,\n    "salary": 2000\n  }\n]}}',
                    },
                  },
                  wait: {
                    type: 'debounce',
                    time: 0,
                  },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'tableData',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue:
                '{{[\n  {\n    "key": 0,\n    "salary": 1000\n  },\n  {\n    "key": 1,\n    "salary": 2000\n  }\n]}}',
            },
          },
        ],
      },
    ],
  },
};
