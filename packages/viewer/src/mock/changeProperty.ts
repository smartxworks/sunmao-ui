import { Application } from '@sunmao-ui/core';

export const BaseSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'stack0',
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
        id: 'text1',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text1',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/hidden',
            properties: {
              hidden: false,
              visually: false,
            },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text2',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styles: [
                {
                  styleSlot: 'content',
                  style: '',
                  cssProperties: {
                    width: '100px',
                    height: '200px',
                    color: 'rgba(245, 166, 35, 1)',
                  },
                },
              ],
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [],
            },
          },
        ],
      },
      {
        id: 'sub_stack1',
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
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text3',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text3',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'sub_stack1',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'sub_sub_stack0',
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
                id: 'sub_stack1',
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

export const Schema1: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'stack0',
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
        id: 'text1',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'foo',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/hidden',
            properties: {
              hidden: false,
              visually: false,
            },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'foo',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styles: [
                {
                  styleSlot: 'content',
                  style: '',
                  cssProperties: {
                    width: '100px',
                    height: '200px',
                    background: 'white',
                    color: 'rgba(245, 166, 35, 1)',
                  },
                },
              ],
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [],
            },
          },
        ],
      },
      {
        id: 'sub_stack1',
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
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text3',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'foo',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'sub_stack1',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'sub_sub_stack0',
        type: 'core/v1/stack',
        properties: {
          spacing: 0,
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
                id: 'sub_stack1',
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

export const Schema2: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'stack0',
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
        id: 'text1',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'bar',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/hidden',
            properties: {
              hidden: false,
              visually: false,
            },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'bar',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styles: [
                {
                  styleSlot: 'content',
                  style: '',
                  cssProperties: {
                    width: '100px',
                    height: '200px',
                    color: 'yellow',
                    backgroundColor: 'black',
                    fontSize: '14px',
                    marginTop: '20px',
                  },
                },
              ],
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [],
            },
          },
        ],
      },
      {
        id: 'sub_stack1',
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
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'text3',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'bar',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'sub_stack1',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
        ],
      },
      {
        id: 'sub_sub_stack0',
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
                id: 'sub_stack1',
                slot: 'content',
              },
              ifCondition: true,
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: '$onMount',
                  componentId: 'stack0',
                  method: {
                    name: '',
                    parameters: {},
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
    ],
  },
};
