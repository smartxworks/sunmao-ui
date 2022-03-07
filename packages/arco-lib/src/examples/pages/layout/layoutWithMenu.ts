import { Application } from "@sunmao-ui/core";

const layoutWithMenu: Application = {
  "version": "sunmao/v1",
  "kind": "Application",
  "metadata": {
    "name": "some App"
  },
  "spec": {
    "components": [
      {
        "id": "layout4",
        "type": "arco/v1/layout",
        "properties": {
          "showHeader": true,
          "showSideBar": true,
          "sidebarCollapsible": false,
          "sidebarDefaultCollapsed": false,
          "showFooter": true
        },
        "traits": []
      },
      {
        "id": "text6",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "XXX Manage Panel",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "header"
              }
            }
          }
        ]
      },
      {
        "id": "menu5",
        "type": "arco/v1/menu",
        "properties": {
          "mode": "vertical",
          "autoOpen": false,
          "collapse": false,
          "accordion": false,
          "ellipsis": false,
          "autoScrollIntoView": false,
          "hasCollapseButton": false,
          "items": [
            {
              "key": "dashboard",
              "text": "DashBorad"
            },
            {
              "key": "users",
              "text": "Users"
            },
            {
              "key": "settings",
              "text": "Settings"
            }
          ],
          "defaultActiveKey": "dashboard"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "sidebar"
              }
            }
          }
        ]
      },
      {
        "id": "text7",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am dashboard.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/hidden",
            "properties": {
              "hidden": "{{menu5.activeKey !== 'dashboard'}}"
            }
          }
        ]
      },
      {
        "id": "text8",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am Users.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/hidden",
            "properties": {
              "hidden": "{{menu5.activeKey !== 'users'}}"
            }
          }
        ]
      },
      {
        "id": "text9",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am Settings.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/hidden",
            "properties": {
              "hidden": "{{menu5.activeKey !== 'settings'}}"
            }
          }
        ]
      },
      {
        "id": "text10",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "XXX Company All rights reserved",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "layout4",
                "slot": "footer"
              }
            }
          }
        ]
      }
    ]
  }
}

export default layoutWithMenu;
