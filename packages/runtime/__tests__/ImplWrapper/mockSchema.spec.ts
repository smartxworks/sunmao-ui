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

export const MockSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'tester1',
        type: 'test/v1/tester',
        properties: {
          testId: 'tester1',
          text: '{{state0.value}}',
        },
        traits: [],
      },
      {
        id: 'button1',
        type: 'test/v1/button',
        properties: {
          testId: 'button1',
        },
        traits: [
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
                      value: '{{state0.value  + 1}}',
                    },
                  },
                  disabled: false,
                  wait: {
                    type: 'delay',
                    time: 0,
                  },
                },
              ],
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
              initialValue: '0',
            },
          },
        ],
      },
    ],
  },
};
