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
        id: "text",
        type: "core/v1/text",
        properties: {
          value: {
            raw: "Multiple Select",
            format: "plain",
          },
        },
        traits: [],
      },
      {
        id: "multiple",
        type: "arco/v1/switch",
        properties: {},
        traits: [],
      },
      {
        id: "text",
        type: "core/v1/text",
        properties: {
          value: {
            raw: "Selected Nodes: {{tree.selectedNodes.map(n => n.title).join(', ')}}",
            format: "plain",
          },
        },
        traits: [],
      },
      {
        id: "tree",
        type: "arco/v1/tree",
        properties: {
          multiple: "{{multiple.value}}",
          size: "medium",
          autoExpandParent: true,
          data: [
            {
              title: "Asia",
              key: "asia",
              children: [
                {
                  title: "China",
                  key: "China",
                  children: [
                    {
                      title: "Guangdong",
                      key: "Guangdong",
                      selectable: false,
                      children: [
                        {
                          title: "Guangzhou",
                          key: "Guangzhou",
                        },
                        {
                          title: "Shenzhen",
                          key: "Shenzhen",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: "Europe",
              key: "Europe",
              children: [
                {
                  title: "France",
                  key: "France",
                  selectable: false,
                },
                {
                  title: "Germany",
                  key: "Germany",
                },
              ],
            },
          ],
        },
        traits: [],
      },
    ],
  },
};

export default basicUsage;
