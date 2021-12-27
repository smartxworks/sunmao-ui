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
                  styles: [
                    {
                      styleSlot: "content",
                      style: "height: 100%; background: #fff;",
                    },
                  ],
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
                  styles: [
                    {
                      styleSlot: "content",
                      style:
                        "height: 50px; display: flex; align-items: center;",
                    },
                  ],
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
                  styles: [
                    {
                      styleSlot: "content",
                      style: "width: 200px; background: #F7F8FB",
                    },
                  ],
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
                  styles: [
                    {
                      styleSlot: "content",
                      style:
                        "margin-left: 24px; img { width: 124px; height: 24px; }",
                    },
                  ],
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
                  value: "iam",
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
                  styles: [
                    {
                      styleSlot: "content",
                      style: "margin-left: 54px; width: 154px;",
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "sider_menu",
            type: "arco/v1/menu",
            properties: {
              items: [
                {
                  key: "user",
                  text: "用户",
                },
                {
                  key: "user_group",
                  text: "用户组",
                },
                {
                  key: "policy",
                  text: "策略",
                },
                {
                  key: "ldap",
                  text: "LDAP",
                },
                {
                  key: "settings",
                  text: "账号设置",
                },
              ],
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
            id: "toolbar",
            type: "arco/v1/space",
            properties: {},
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
              {
                type: "core/v1/style",
                properties: {
                  styles: [
                    {
                      styleSlot: "content",
                      style: "padding: 20px;",
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "create_user_button",
            type: "arco/v1/button",
            properties: {
              type: "primary",
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "toolbar",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "create_user",
            type: "core/v1/text",
            properties: {
              value: {
                raw: "创建用户",
                format: "plain",
              },
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "create_user_button",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "more_user_operation_dropdown",
            type: "arco/v1/dropdown",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "toolbar",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "more_user_operation_button",
            type: "arco/v1/button",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "more_user_operation_dropdown",
                    slot: "trigger",
                  },
                },
              },
              {
                type: "core/v1/style",
                properties: {
                  styles: [
                    {
                      styleSlot: "content",
                      style: "margin-left: 10px;",
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "more_user_operation",
            type: "core/v1/text",
            properties: {
              value: {
                raw: "更多操作",
                format: "plain",
              },
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "more_user_operation_button",
                    slot: "content",
                  },
                },
              },
            ],
          },
          {
            id: "more_user_operation_list",
            type: "arco/v1/menu",
            properties: {
              items: [
                {
                  key: "op1",
                  text: "op1",
                },
              ],
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "more_user_operation_dropdown",
                    slot: "list",
                  },
                },
              },
            ],
          },
          {
            id: "user_search",
            type: "arco/v1/input",
            properties: {},
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "toolbar",
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
