import { Application } from "@sunmao-ui/core";

const longButton: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "longButton",
    description: "longButton",
  },
  spec: {
    components: [
      {
        id: "space",
        type: "arco/v1/space",
        properties: {
          direction: "vertical",
        },
        traits: [
          {
            type: "core/v1/style",
            properties: {
              styles: [
                {
                  styleSlot: "content",
                  style: "width: 360px; border: 1px solid #ddd; padding: 32px",
                },
              ],
            },
          },
        ],
      },
      {
        id: "button1",
        type: "arco/v1/button",
        properties: {
          text: "primary",
          type: "primary",
          long: true,
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: {
                id: "space",
                slot: "content",
              },
            },
          },
        ],
      },
      {
        id: "button2",
        type: "arco/v1/button",
        properties: {
          text: "primary",
          type: "primary",
          long: true,
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: {
                id: "space",
                slot: "content",
              },
            },
          },
        ],
      },
    ],
  },
};

export default longButton;
