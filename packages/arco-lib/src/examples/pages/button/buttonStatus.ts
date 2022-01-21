import { Application } from "@sunmao-ui/core";

const buttonStatus: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "buttonStatus",
    description: "buttonStatus",
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
          text: "warning",
          status: "warning",
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
          text: "danger",
          status: "danger",
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
          text: "success",
          status: "success",
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

export default buttonStatus;
