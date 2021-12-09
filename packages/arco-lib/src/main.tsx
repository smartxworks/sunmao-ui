import { initSunmaoUI } from "@sunmao-ui/runtime";
import ReactDOM from "react-dom";
import { install } from "./lib";
import "./main.css";

const { App, registry } = initSunmaoUI();

install(registry);

ReactDOM.render(
  <App
    debugEvent={false}
    debugStore={false}
    options={{
      kind: "Application",
      version: "arco/v1",
      metadata: {
        name: "playground",
      },
      spec: {
        components: [
          {
            id: "root",
            type: "arco/v1/layout",
            properties: {},
            traits: [
              {
                type: "core/v1/style",
                properties: {
                  styleSlot: "content",
                  style: "height: 100%; background: #fff;",
                },
              },
            ],
          },
          {
            id: "header",
            type: "arco/v1/header",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "root",
                    slot: "content",
                  },
                },
              },
              {
                type: "core/v1/style",
                properties: {
                  styleSlot: "content",
                  style: "height: 50px; display: flex; align-items: center;",
                },
              },
            ],
          },
          {
            id: "body",
            type: "arco/v1/layout",
            properties: {
              hasSider: true,
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "root",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "sider",
            type: "arco/v1/sider",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "body",
                    slot: "content",
                  },
                },
              },
              {
                type: "core/v1/style",
                properties: {
                  styleSlot: "content",
                  style: "width: 200px; background: #F7F8FB",
                },
              },
            ],
          },
          {
            id: "content",
            type: "arco/v1/content",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "body",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "logo",
            type: "arco/v1/image",
            properties: {
              src:
                "https://www.smartx.com/img/smartx-logo-horizontal.ff708dd4.svg",
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "header",
                    slot: "content",
                  },
                },
              },
              {
                type: "core/v1/style",
                properties: {
                  styleSlot: "content",
                  style:
                    "margin-left: 24px; img { width: 124px; height: 24px; }",
                },
              },
            ],
          },
          {
            id: "nav_menu",
            type: "arco/v1/select",
            properties: {
              defaultValue: "IAM",
              options: [
                {
                  text: "IAM",
                },
              ],
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "header",
                    slot: "content",
                  },
                },
              },
              {
                type: "core/v1/style",
                properties: {
                  styleSlot: "content",
                  style: "margin-left: 54px; width: 154px;",
                },
              },
            ],
          },
          {
            id: "text_2",
            type: "core/v1/text",
            properties: {
              value: {
                raw: "sider",
                format: "plain",
              },
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "sider",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "text_1",
            type: "core/v1/text",
            properties: {
              value: {
                raw: "content",
                format: "plain",
              },
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "content",
                    slot: "content",
                  },
                },
              },
            ],
          },
        ],
      },
    }}
  />,
  document.getElementById("root")
);
