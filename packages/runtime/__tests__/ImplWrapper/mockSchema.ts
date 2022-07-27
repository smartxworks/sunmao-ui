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
