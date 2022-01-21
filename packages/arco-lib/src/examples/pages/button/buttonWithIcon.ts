import { Application } from "@sunmao-ui/core";

const buttonWithIcon: Application = {
  kind: "Application",
  version: "example/v1",
  metadata: {
    name: "buttonWithIcon",
    description: "buttonWithIcon",
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
        id: "iconplus",
        type: "arco/v1/icon",
        properties: {
          name: "IconPlus",
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: {
                id: "button1",
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
          text: "delete",
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
        id: "iconplus2",
        type: "arco/v1/icon",
        properties: {
          name: "IconDelete",
        },
        traits: [
          {
            type: "core/v1/slot",
            properties: {
              container: {
                id: "button2",
                slot: "content",
              },
            },
          },
        ],
      },
    ],
  },
};

export default buttonWithIcon;
