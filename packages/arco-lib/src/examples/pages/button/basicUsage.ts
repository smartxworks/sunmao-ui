import { Application } from "@sunmao-ui/core";

const basicUsage: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "buttonBasicUsage",
    description: "buttonBasicUsage",
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
          text: "secondary",
          type: "secondary",
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
          text: "dashed",
          type: "dashed",
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
          text: "outline",
          type: "outline",
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
        id: "button5",
        type: "arco/v1/button",
        properties: {
          text: "text",
          type: "text",
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
        id: "button6",
        type: "arco/v1/button",
        properties: {
          text: "disabled",
          type: "primary",
          disabled: true,
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
        id: "button7",
        type: "arco/v1/button",
        properties: {
          text: "loading",
          type: "primary",
          loading: true,
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

export default basicUsage;
