import { Application } from "@sunmao-ui/core";

const buttonEvent: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "buttonEvent",
    description: "buttonEvent",
  },
  spec: {
    components: [
      {
        id: "space",
        type: "arco/v1/space",
        properties: {},
        traits: [],
      },
      {
        id: "button1",
        type: "arco/v1/button",
        properties: {
          text: "Click",
          type: "primary",
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: { id: "space", slot: "content" },
            },
          },
          {
            type: "core/v1/event",
            properties: {
              handlers: [
                {
                  type: "onClick",
                  componentId: "count",
                  method: {
                    name: "setValue",
                    parameters: {
                      key: "value",
                      value: "{{count.value + 1}}",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        id: "text1",
        type: "core/v1/text",
        properties: {
          value: { raw: "click count: {{count.value}}", format: "plain" },
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: { id: "space", slot: "content" },
            },
          },
        ],
      },
      {
        id: "count",
        type: "core/v1/dummy",
        properties: {},
        traits: [
          {
            type: "core/v1/state",
            properties: { key: "value", initialValue: 0 },
          },
        ],
      },
    ],
  },
};

export default buttonEvent;
