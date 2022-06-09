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
          testId: 'single',
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
          testId: 'staticComponent',
          text: 'foo',
        },
        traits: [],
      },
      {
        id: 'dynamicComponent',
        type: 'test/v1/tester',
        properties: {
          testId: 'dynamicComponent',
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
          testId: '',
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
          testId: 'tester',
          text: '{{input1.value}}',
        },
        traits: [],
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
          testId: 'tester',
          text: '{{input.value}}-{{input2.value}}-{{input3.value}}',
        },
        traits: [],
      },
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          testId: '',
          defaultValue: 'foo',
        },
        traits: [],
      },
      {
        id: 'input2',
        type: 'test/v1/input',
        properties: {
          testId: '',
          defaultValue: 'bar',
        },
        traits: [],
      },
      {
        id: 'input3',
        type: 'test/v1/input',
        properties: {
          testId: '',
          defaultValue: 'baz',
        },
        traits: [],
      },
    ],
  },
};
