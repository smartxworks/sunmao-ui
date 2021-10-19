import { Application } from '@meta-ui/core';

export const DefaultAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'dialog_component',
    description: 'dialog component example',
  },
  spec: {
    components: [
      {
        id: 'root',
        type: 'chakra_ui/v1/root',
        properties: {},
        traits: [],
      },
      {
        id: 'btn',
        type: 'plain/v1/button',
        properties: {
          text: {
            raw: '**Open Dialog**',
            format: 'md',
          },
          colorScheme: 'red',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'root',
              },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'onClick',
                  componentId: 'dialog',
                  method: {
                    name: 'openDialog',
                    parameters: {
                      title: 'hi',
                    },
                  },
                  wait: {},
                },
              ],
            },
          },
        ],
      },
      {
        id: 'dialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'This is a dialog',
          confirmButton: {
            text: 'hello',
            colorScheme: 'pink',
          },
          cancelButton: {
            text: 'thanks',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'root',
              },
            },
          },
          // dialog events
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                // when click confirm
                {
                  type: 'confirmDialog',
                  componentId: 'dialog',
                  method: {
                    name: 'confirmDialog',
                  },
                  wait: {},
                  disabled: 'false',
                },
                // when cancel confirm
                {
                  type: 'cancelDialog',
                  componentId: 'dialog',
                  method: {
                    name: 'cancelDialog',
                  },
                  wait: {},
                  disabled: 'false',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'dialogContent',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: '**This is a dialog**',
            format: 'md',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'dialog',
                slot: 'content',
              },
            },
          },
        ],
      },
    ],
  },
};
