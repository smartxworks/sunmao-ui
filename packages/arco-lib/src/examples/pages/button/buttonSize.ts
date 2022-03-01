import { Application } from "@sunmao-ui/core";

const buttonSize: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "buttonSize",
    description: "buttonSize",
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
          text: "primary",
          type: "primary",
          size: "mini",
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
          size: "small",
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
        id: "button3",
        type: "arco/v1/button",
        properties: {
          text: "primary",
          type: "primary",
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
        id: "button4",
        type: "arco/v1/button",
        properties: {
          text: "primary",
          type: "primary",
          size: "large",
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

export default buttonSize;
